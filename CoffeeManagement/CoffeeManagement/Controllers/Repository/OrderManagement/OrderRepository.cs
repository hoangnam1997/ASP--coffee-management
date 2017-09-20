using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using CoffeeManagement.Models;
using System.Data.Entity.Core;
namespace CoffeeManagement.Controllers.Repository.OrderManagement
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        // ReSharper disable once InconsistentNaming
        private readonly GalaxyCoffeeEntities db = new GalaxyCoffeeEntities();
        /// <summary>
        /// Lấy promotion theo thời gian tạo hóa đơn
        /// </summary>
        /// <param name="order">time order</param>
        /// <param name="shopId"></param>
        /// /// <param name="isDelete"></param>
        /// <returns></returns>
        public Promotion GetPromotionByTimeOrder(DateTime order,int shopId, bool isDelete = false)
        {
            Promotion result = null;
            if (db == null) return null;
            try
            {
                result =db.Promotion.SingleOrDefault(p => p.StartDate <= order && (p.EndDate ==null || p.EndDate >= order) && p.ShopID== shopId && p.IsDelete== isDelete);
            }
            catch (EntityException ex)
            {
                Console.WriteLine("Cann't load database\n" + ex.Message);
            }
            return result;
        }
        /// <summary>
        /// get order by time and shop id
        /// </summary>
        /// <param name="fromDate">day start </param>
        /// <param name="endDate"></param>
        /// /// <param name="shopId"></param>
        /// /// <param name="isDelete"></param>
        /// <returns></returns>
        public List<Order> GetOrderByTime(DateTime fromDate, DateTime endDate, int shopId, bool isDelete = false)
        {
            List<Order> result = new List<Order>();
            if (db == null) return result;
            try
            {

                result = db.Order.Where(p => (p.CreateAt >= fromDate.Date && p.CreateAt <= endDate.Date && p.Table.ShopID == shopId && p.IsDelete == isDelete)).ToList();
            }
            catch (EntityException ex)
            {
                Console.WriteLine("Cann't load database\n" + ex.Message);
            }
            return result;
        }

        //Vuong
        public bool ChangeStatusOrderProduct(int a, string status, int shopId)
        {
            var s = db.OrderProduct.Any(x => x.ID == a && x.Product.ShopID ==shopId);
            if (s != true) return false;
            {
                var orderproduct = db.OrderProduct.SingleOrDefault(x => x.ID == a);
                if (orderproduct != null)
                {
                    orderproduct.Status = status;
                    db.Entry(orderproduct).State = EntityState.Modified;
                }
                db.SaveChanges();
                return true;
            }
        }

        public bool IsChangeDataset()
        {
            return true;
        }

        public List<OrderProduct> GetOrderProductByStatus(string[] status, int shopId)
        {

            var orderProducts = db.Order.Include(m => m.OrderProduct)
                .SelectMany(m => m.OrderProduct)
                .Include(m => m.Product).OrderBy(x => x.OrderID).ThenBy(x => x.Order.CreateAt)
                .Where(m => status.Any(x => x == m.Status) && m.Product.ShopID== shopId)
                .ToList();
            return orderProducts;
        }

        /// <summary>
        /// get Order By SingleStatus
        /// </summary>
        /// <param name="status">input status</param>
        /// <param name="shopId"></param>
        /// <returns></returns>
        public List<OrderProduct> GetOrderBySingleStatus(string status, int shopId)
        {
            var orderProducts = db.Order.Include(m => m.OrderProduct)
                .SelectMany(m => m.OrderProduct)
                .Include(m => m.Product)
                .Where(m => m.Status == status && m.Product.ShopID==shopId)
                .OrderBy(x => x.Order.CreateAt).ThenBy(x => x.OrderID)
                .ToList();
            foreach (var item in orderProducts)
            {
                ChangeStatusOrderProduct(item.ID, "2", shopId);
            }
            return orderProducts;
        }

        /// <summary>
        /// Update table by ShopID
        /// </summary>
        /// <param name="count">get number orderproduct</param>
        /// <param name="id">get orderproduct from ID</param>
        /// <param name="index">0 is stare at OrderProductID, 1 is state at OrderProductID +1</param>
        /// <param name="shopId">by ShopID</param>
        /// <returns></returns>
        public List<OrderProduct> UpdateTable(int count, int id, int index, int shopId)
        {
            var singleOrDefault = db.Order.SingleOrDefault(x => x.ID == id&& x.Table.ShopID == shopId);
            if (singleOrDefault == null) return null;
            {
                var datetime = singleOrDefault.CreateAt;
                var lstorder = db.Order.Where(m => m.CreateAt >= datetime && m.ID >= id+ index && m.Table.ShopID== shopId).Take(count + 1).Select(x => x.ID).ToList();
                var orderProducts = db.Order.Include(m => m.OrderProduct)
                    .SelectMany(m => m.OrderProduct)
                    .Include(m => m.Product)
                    .Where(m => lstorder.Any(x => x == m.OrderID) && (m.Status == "1" || m.Status == "2"))
                    .OrderBy(x => x.Order.CreateAt).ThenBy(x => x.OrderID)
                    .ToList();
                if (count > orderProducts.Count)
                    return orderProducts;
                var lstOrder = new List<OrderProduct>();
                for (var i = 0; i < orderProducts.Count - 1; i++)
                {
                    for (var j = i; j < orderProducts.Count; j++)
                    {
                        if (orderProducts[i].OrderID != orderProducts[j].OrderID)
                        {
                            i = j - 1;
                            break;
                        }
                        lstOrder.Add(orderProducts[j]);
                    }
                    if (lstOrder.Count > count)
                    {
                        break;
                    }
                }
                return lstOrder;
            }
        }
    }
}