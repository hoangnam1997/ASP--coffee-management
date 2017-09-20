using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CoffeeManagement.Controllers.Service.OrderManagement
{
    public class OrderProductService : BaseService<OrderProduct>, IOrderProductService
    {
        public OrderProductService(IBaseRepository<OrderProduct> baseRepo) : base(baseRepo)
        {
        }
        public IEnumerable<OrderView> GetOrderView(DateTime? createDate, int shop_id, string tableName, string promotionName, string customerName)
        {
            var orderview = from r in _baseRepo.GetAll().Where(x => x.IsDelete == false && x.Order.IsDelete == false && x.Order.Table.ShopID == shop_id)
                            select new
                            {
                                Id = r.OrderID,
                                TableId = r.Order.TableID,
                                TableName = r.Order.Table.Name,
                                PromotionId = r.Order.PromotionID == null ? 0 : r.Order.PromotionID,
                                PromotionName = r.Order.Promotion != null ? r.Order.Promotion.Name : "",
                                PromotionBasePurchase = r.Order.Promotion != null ? r.Order.Promotion.BasePurchase : 0,
                                PromotionDiscount = r.Order.Promotion != null ? r.Order.Promotion.Discount : 0,
                                CustomerId = r.Order.AspNetUsers.Id,
                                CustomerName = r.Order.AspNetUsers.Name,
                                CreateDate = r.Order.CreateAt,
                                PricePromotion = r.Order.Promotion != null ? (r.Product.UnitPrice - r.Product.UnitPrice * r.Order.Promotion.Discount / 100) : 0,
                                Price = r.Product.UnitPrice
                            };
            if (tableName != null)
            {
                orderview = from r in orderview
                            where r.TableName.ToLower().Contains(tableName.ToLower())
                            select r;
            }
            if (customerName != null)
            {
                orderview = from r in orderview
                            where r.CustomerName.ToLower().Contains(customerName.ToLower())
                            select r;
            }
            if (promotionName != null)
            {
                orderview = from r in orderview
                            where r.PromotionName.ToLower().Contains(promotionName.ToLower())
                            select r;
            }
            if (createDate.HasValue)
            {
                orderview = from r in orderview
                            where r.CreateDate.Value.ToShortDateString().Equals(createDate.Value.ToShortDateString())
                            select r;
            }
            var orderview_group = from ov in orderview  // group orderview
                                  group ov by new
                                  {
                                      ov.Id,
                                      ov.TableId,
                                      ov.TableName,
                                      ov.PromotionId,
                                      ov.PromotionName,
                                      ov.PromotionBasePurchase,
                                      ov.CustomerId,
                                      ov.CustomerName,
                                      ov.CreateDate
                                  } into ordergroup

                                  select new
                                  {
                                      Id = ordergroup.Key.Id,
                                      TableId = ordergroup.Key.TableId,
                                      TableName = ordergroup.Key.TableName,
                                      PromotionId = ordergroup.Key.PromotionId,
                                      PromotionName = ordergroup.Key.PromotionName,
                                      CustomerId = ordergroup.Key.CustomerId,
                                      CustomerName = ordergroup.Key.CustomerName,
                                      CreateDate = ordergroup.Key.CreateDate,
                                      Total = ((ordergroup.Sum(x => x.PricePromotion) < ordergroup.Key.PromotionBasePurchase) || ordergroup.Key.PromotionBasePurchase == 0) ? ordergroup.Sum(x => x.Price) : ordergroup.Sum(x => x.PricePromotion)
                                  };
            var orderviews = new List<OrderView>();
            foreach (var item in orderview_group)
            {
                orderviews.Add(new OrderView()
                {
                    Id = item.Id,
                    TableId = item.TableId,
                    TableName = item.TableName,
                    PromotionId = (int)item.PromotionId,
                    PromotionName = item.PromotionName,
                    CustomerId = item.CustomerId,
                    CustomerName = item.CustomerName,
                    CreateDate = (DateTime)item.CreateDate,
                    Total = (float)item.Total
                });
            }

            return orderviews;
        }
        public IEnumerable<OrderProductViewModel> GetOrderProduct(int shop_id, int order_id)
        {
            // Get orderproducts 
            var orderproducts = from op in _baseRepo.GetAll().Where(x => x.IsDelete == false && x.Product.ShopID == shop_id && x.OrderID == order_id)
                                select new
                                {
                                    ProductName = op.Product.Name,
                                    Price = op.Product.UnitPrice,
                                    Promotions = (op.Order.Promotion != null) ? (op.Product.UnitPrice * op.Order.Promotion.Discount / 100) : 0,
                                    Status = op.Status
                                };
            
            var orderproductview = from r in orderproducts  // create orderproductview
                                   group r by new
                                   {
                                       r.ProductName,
                                       r.Promotions,
                                       r.Status
                                   } into orderproductgroup
                                   select new 
                                   {
                                       ProductName = orderproductgroup.Key.ProductName,
                                       TotalPrice = orderproductgroup.Sum(x => x.Price),
                                       Sale = orderproductgroup.Key.Promotions,
                                       Quantity = orderproductgroup.Count(),
                                       Status = orderproductgroup.Key.Status
                                   };
            var orderproductviews = new List<OrderProductViewModel>(); // create list orderproductviewmodel
            foreach (var item in orderproductview)
            {
                orderproductviews.Add(new OrderProductViewModel()
                {
                    ProductName = item.ProductName,
                    TotalPrice = (float)item.TotalPrice,
                    Sale = (float)item.Sale,
                    Quantity = item.Quantity,
                    Status = item.Status
                });
            }
            return orderproductviews;
        }
    }
}