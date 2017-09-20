using CoffeeManagement.Models;
using System;
using System.Collections.Generic;

namespace CoffeeManagement.Controllers.Repository.OrderManagement
{
    public interface IOrderRepository : IBaseRepository<Order>
    {
        Promotion GetPromotionByTimeOrder(DateTime order, int shopId,bool isDelete=false);
        List<Order> GetOrderByTime(DateTime fromDate, DateTime endDate, int idShop, bool isDelete=false);



        bool ChangeStatusOrderProduct(int a, string status, int shopId);

        bool IsChangeDataset();


        List<OrderProduct> GetOrderProductByStatus(string[] status,int shopId);

        List<OrderProduct> GetOrderBySingleStatus(string status,int shopId);

        List<OrderProduct> UpdateTable(int count, int id, int index,int shopID);
    }
}