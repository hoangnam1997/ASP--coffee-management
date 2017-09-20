using System;
using System.Collections.Generic;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;

namespace CoffeeManagement.Controllers.Service.OrderManagement
{
    public interface IOrderService : IBaseService<Order>
    {
        List<StatisticsViewModel> GetListStatisticsViewModelDays(DateTime fromDay, DateTime endDay, int shopId);
        List<StatisticsViewModel> GetListStatisticsViewModelGroupProduct(DateTime fromDay, DateTime endDay, int shopId);
        List<StatisticsViewModel> GetListStatisticsViewModelProduct(DateTime fromDay, DateTime endDay, int shopId);


        List<OrderProduct> GetOrderProductByStatus(string[] status, int shopId);
        bool ChangeStatusOrderProduct(string a, string status, int shopId);
        List<OrderProduct> GetOrderBySingleStatus(string status, int shopId);
        bool ChangSatusIsDelete(int id);
        List<OrderProduct> UpdateTable(int count, int id,int index, int shopId);
        List<OrderViewModel> GetListOrder(int count, List<OrderViewModel> lst);
        List<OrderViewModel> RenderOrderProductToViewModel(List<OrderProduct> lst);
        List<OrderViewModel> ShotByOrderId(List<OrderViewModel> lst);

    }
}
