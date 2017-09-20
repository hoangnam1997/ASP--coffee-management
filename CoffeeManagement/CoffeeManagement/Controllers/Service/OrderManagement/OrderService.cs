using System;
using System.Collections.Generic;
using System.Linq;
using CoffeeManagement.Models;
using System.Data.Entity.Core;
using CoffeeManagement.Controllers.Repository.OrderManagement;
using CoffeeManagement.Models.ViewModel;

namespace CoffeeManagement.Controllers.Service.OrderManagement
{
    public class OrderService : BaseService<Order>, IOrderService
    {
        private IOrderRepository _orderRepository;
        private string statusDone = "3";
        public OrderService(IOrderRepository baseRepo) : base(baseRepo)
        {
            _orderRepository = baseRepo;
        }
        /// <summary>
        /// Lấy thống kê theo sản phẩm
        /// </summary>
        /// <param name="fromDay"></param>
        /// <param name="endDay"></param>
        /// <param name="shopId"></param>
        /// <returns></returns>
        public List<StatisticsViewModel> GetListStatisticsViewModelProduct(DateTime fromDay, DateTime endDay, int shopId)
        {
            endDay = endDay.AddHours(23).AddMinutes(59).AddSeconds(58);
            var result = new List<StatisticsViewModel>();
            var listOrder = _orderRepository.GetOrderByTime(fromDay, endDay, shopId);
            //get total money
            foreach (var itemOrder in listOrder)
            {
                result.AddRange(GetProductStatisticByOrder(itemOrder));
            }
            //group by date of statistics
            List<StatisticsViewModel> resultFinal = result.GroupBy(p => p.Data)
                .Select(group =>
                new StatisticsViewModel { Data = group.Key, NumberOfBill = group.Count(), Revenue = group.Sum(p => p.Revenue) }).OrderBy(p => p.Data).ToList();
            return resultFinal;
        }
        /// <summary>
        /// get group product with sales and count by time
        /// </summary>
        /// <param name="fromDay">Ngày bắt đầu</param>
        /// <param name="endDay">Ngày kết thúc</param>
        /// <param name="shopId">Shop Id</param>
        /// <returns></returns>
        public List<StatisticsViewModel> GetListStatisticsViewModelGroupProduct(DateTime fromDay, DateTime endDay, int shopId)
        {
            endDay = endDay.AddHours(23).AddMinutes(59).AddSeconds(58);
            var result = new List<StatisticsViewModel>();
            var listOrder = _orderRepository.GetOrderByTime(fromDay, endDay, shopId);
            //get total money
            foreach (var itemOrder in listOrder)
            {
                result.AddRange(GetProductStatisticByOrder(itemOrder));
            }
            //group by date of statistics
            var resultFinal = result.GroupBy(p => p.Description)
                .Select(group =>
                new StatisticsViewModel { Data = group.Key, NumberOfBill = group.Count(), Revenue = group.Sum(p => p.Revenue) }).OrderBy(p => p.Data).ToList();
            return resultFinal;
        }

        /// <summary>
        /// Get StatisticsViewModel by time
        /// </summary>
        /// <param name="fromDay">time start</param>
        /// <param name="endDay">time end of statistics</param>
        /// <param name="shopId"></param>
        /// <returns></returns>
        public List<StatisticsViewModel> GetListStatisticsViewModelDays(DateTime fromDay, DateTime endDay, int shopId)
        {
            endDay = endDay.AddHours(23).AddMinutes(59).AddSeconds(58);
            var result = new List<StatisticsViewModel>();
            var listOrder = _orderRepository.GetOrderByTime(fromDay, endDay, shopId);
            //get total money
            foreach (var itemOrder in listOrder)
            {
                if (itemOrder.CreateAt != null)
                    result.Add(new StatisticsViewModel()
                    {
                        Data = ((DateTime)itemOrder.CreateAt).Date.ToString("dd-MM-yyyy"),
                        NumberOfBill = 1,
                        Revenue = TotalPriceOrder(itemOrder)
                    });
            }
            //group by date of statistics
            var resultFinal = result.GroupBy(p => p.Data)
                .Select(group =>
                new StatisticsViewModel { Data = group.Key, NumberOfBill = group.Count(), Revenue = group.Sum(p => p.Revenue) }).OrderBy(p => p.Data).ToList();
            return resultFinal;
        }
        /// <summary>
        /// //get listProduct by Order (data,Revenue,NumberOfBill,Description)
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        private List<StatisticsViewModel> GetProductStatisticByOrder(Order order)
        {
            var result = new List<StatisticsViewModel>();
            var promotionDiscount = 0;
            //get promotion
            if (order.CreateAt != null)
            {
                var orderPromotion = GetPromotionByTimeOrder((DateTime)order.CreateAt, order.Table.ShopID);
                if (order.CreateAt != null)
                {
                    double totalPrice = 0;
                    //tính promotion trên product
                    foreach (var item in order.OrderProduct)
                    {
                        //check status and isdelete
                        if ((!item.Status.Equals(statusDone)) || item.IsDelete == true) continue;
                        double priceProduct;
                        if (!double.TryParse(item.Product.UnitPrice.ToString(), out priceProduct)) continue;
                        if (item.Product.Discount == null) continue;
                        var finalProductPrice = totalPriceProduct(1, priceProduct, (int)item.Product.Discount);
                        result.Add(new StatisticsViewModel
                        {
                            Data = item.Product.Name,
                            Description = item.Product.ProductCategory.Name,
                            Revenue = finalProductPrice,
                            NumberOfBill = 0
                        });
                        totalPrice += finalProductPrice;
                    }
                    //check promotion trên order
                    if (orderPromotion != null)
                    {
                        int promotionBasePurchase;
                        if (Int32.TryParse(orderPromotion.BasePurchase.ToString(), out promotionBasePurchase))
                        {
                            if (promotionBasePurchase <= totalPrice)
                            {
                                Int32.TryParse(orderPromotion.Discount.ToString(), out promotionDiscount);
                            }
                        }
                    }
                }
            }
            var resultFinal = result.GroupBy(p => new { p.Data, p.Description })
                .Select(group =>
                    new StatisticsViewModel { Data = @group.Key.Data, NumberOfBill = 1, Revenue = totalPriceOrderWithPromotion(@group.Sum(p => p.Revenue), promotionDiscount), Description = @group.Key.Description })
                .OrderBy(p => p.Data).ToList();
            return resultFinal;
        }
        /// <summary>
        /// lấy promotion of shop tại thời điểm tạo hóa đơn
        /// </summary>
        /// <param name="order"></param>
        /// <param name="shopId"></param>
        /// <returns></returns>
        private Promotion GetPromotionByTimeOrder(DateTime order, int shopId)
        {
            return _orderRepository.GetPromotionByTimeOrder(order, shopId);
        }
        /// <summary>
        /// return total price product with discount
        /// </summary>
        /// <param name="countProduct">number of product</param>
        /// <param name="priceProduct">price of product</param>
        /// <param name="discountProduct">discount</param>
        /// <returns></returns>
        private double totalPriceProduct(double countProduct, double priceProduct, double discountProduct)
        {
            return (countProduct * priceProduct) / 100.0 * (100 - discountProduct);
        }
        /// <summary>
        /// return total price with discount for total all order
        /// </summary>
        /// <param name="price"></param>
        /// <param name="promotion"></param>
        /// <returns></returns>
        private double totalPriceOrderWithPromotion(double price, double promotion)
        {
            return (price / 100.0) * (100 - promotion);
        }
        /// <summary>
        /// return price of order
        /// </summary>
        /// <param name="myOrder">Order parameter</param>
        /// <returns></returns>
        private double TotalPriceOrder(Order myOrder)
        {
            double totalPrice = 0;
            try
            {
                // set total price of order and add to list statisticViewModel
                foreach (var itemOrderProduct in myOrder.OrderProduct.ToList())
                {
                    if ((!itemOrderProduct.Status.Equals(statusDone)) || itemOrderProduct.IsDelete == true) continue;
                    double priceProduct;
                    if (!double.TryParse(itemOrderProduct.Product.UnitPrice.ToString(), out priceProduct)) continue;
                    if (itemOrderProduct.Product.Discount != null)
                        totalPrice += totalPriceProduct(1, priceProduct, (int) itemOrderProduct.Product.Discount);
                }
                // check promotion of order. get promotion by time
                if (myOrder.CreateAt != null)
                {
                    var orderPromotion = GetPromotionByTimeOrder((DateTime)myOrder.CreateAt, myOrder.Table.ShopID);
                    if (orderPromotion != null)
                    {
                        int promotionBasePurchase;
                        if (int.TryParse(orderPromotion.BasePurchase.ToString(), out promotionBasePurchase))
                        {
                            int promotionRecord;
                            if (int.TryParse(orderPromotion.Discount.ToString(), out promotionRecord))
                            {
                                //check validate
                                if (promotionBasePurchase <= totalPrice)
                                {
                                    totalPrice = totalPriceOrderWithPromotion(totalPrice, promotionRecord);
                                }
                            }
                        }
                    }
                }
            }
            catch (EntityException ex)
            {
                Console.Write(ex.Message);
            }
            return totalPrice;
        }


        //vuong


        //ok
        public List<OrderProduct> GetOrderProductByStatus(string[] status, int shopId)
        {
            return _orderRepository.GetOrderProductByStatus(status, shopId);
        }


        //ok
        public bool ChangeStatusOrderProduct(string a, string status, int shopId)
        {
            int b;
            int.TryParse(a, out b);
            return _orderRepository.ChangeStatusOrderProduct(b, status, shopId);
        }


        //ok
        public List<OrderProduct> GetOrderBySingleStatus(string status, int shopId)
        {
            return _orderRepository.GetOrderBySingleStatus(status, shopId);
        }

        public bool ChangSatusIsDelete(int id)
        {
            throw new NotImplementedException();
        }


        //ok
        public List<OrderProduct> UpdateTable(int count, int id, int index, int shopId)
        {
            return _orderRepository.UpdateTable(count, id, index, shopId);
        }

        public List<OrderViewModel> GetListOrder(int count, List<OrderViewModel> lst)
        {
            //get 20 quantity hoặc 10 order
            var lstOrder = new List<OrderViewModel>();
            for (var i = 0; i < lst.Count - 1; i++)
            {
                for (var j = i; j < lst.Count; j++)
                {
                    if (lst[i].OrderId != lst[j].OrderId)
                    {
                        i = j - 1;
                        break;
                    }
                    lstOrder.Add(lst[j]);
                }
                if (lstOrder.Count > count)
                {
                    break;
                }
            }
            return lstOrder;
        }


        /// <summary>
        /// convert OrderProduct to ViewModel
        /// </summary>
        /// <param name="lst">is list of OrderProduct</param>
        /// <returns></returns>
        public List<OrderViewModel> RenderOrderProductToViewModel(List<OrderProduct> lst)
        {
            var lstOrderProduct = lst.Select(m => new OrderViewModel()
            {
                OrderId = m.OrderID,
                OrderProductId = m.ID,
                ProductId = m.ProductID,
                ProductName = m.Product.Name,
                Status = m.Status,
                TableId = m.Order.TableID,
                Image = m.Product.Image,
                CreateAt = m.Order.CreateAt,
            }).ToList();
            return lstOrderProduct;
        }

        public List<OrderViewModel> ShotByOrderId(List<OrderViewModel> lst)
        {
            return lst.OrderBy(m => m.OrderId)
                .ThenBy(m => m.OrderProductId)
                .ThenBy(m => m.CreateAt)
                .ThenBy(m => m.Status)
                .ToList();
        }
    }
}