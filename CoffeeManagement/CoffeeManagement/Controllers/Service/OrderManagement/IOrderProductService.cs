using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;
using System;
using System.Collections.Generic;

namespace CoffeeManagement.Controllers.Service.OrderManagement
{
    public interface IOrderProductService : IBaseService<OrderProduct>
    {
        IEnumerable<OrderView> GetOrderView(DateTime? createDate, int shop_id, string tableName, string promotionName, string customerName);
        IEnumerable<OrderProductViewModel> GetOrderProduct(int shop_id, int order_id);
    }
}