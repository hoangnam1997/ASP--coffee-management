using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using CoffeeManagement.Models;
using CoffeeManagement.Controllers.Service.OrderManagement;
using CoffeeManagement.Controllers.Repository.OrderManagement;
using CoffeeManagement.Helpers;

namespace CoffeeManagement.Controllers
{
    [CustomAuthorize("Admin,Manager")]
    public class StatisticsController : Controller
    {
        /// <summary>
        /// GET: SalesStatistics page when load
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            ViewBag.endDate = DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).ToString("yyyy-MM-dd");
            return View();
        }
        /// <summary>
        /// get view chart and table statistic.
        /// </summary>
        /// <returns></returns>
        
        public ActionResult StatisticSalse(string startDay, string endDay, string statisticStyle)
        {
            List<StatisticsViewModel> listViewStatistics;
            //shop ID
            int shopId;
            if (this.GetShopId()==-1)
            {
                return Content("<p><b>Không tìm thấy shop.</b></p>");
            }
            if (string.IsNullOrEmpty(startDay) || string.IsNullOrEmpty(endDay) || (!int.TryParse(this.GetShopId().ToString(), out shopId)))
            {
                return Content("<p><b>Không tìm thấy dử liệu thống kê.</b></p>");
            }
            OrderService orderService = new OrderService(new OrderRepository());
            switch (statisticStyle)
            {
                case "days":
                    ViewBag.statisticStyle = "Ngày";
                    listViewStatistics = orderService.GetListStatisticsViewModelDays(DateTime.ParseExact(startDay, "yyyy-MM-dd", null), DateTime.ParseExact(endDay, "yyyy-MM-dd", null), shopId);
                    break;
                case "products":
                    ViewBag.statisticStyle = "Sản phẩm";
                    listViewStatistics = orderService.GetListStatisticsViewModelProduct(DateTime.ParseExact(startDay, "yyyy-MM-dd", null), DateTime.ParseExact(endDay, "yyyy-MM-dd", null), shopId);
                    break;
                case "groupProducts":
                    ViewBag.statisticStyle = "Nhóm sản phẩm";
                    listViewStatistics = orderService.GetListStatisticsViewModelGroupProduct(DateTime.ParseExact(startDay, "yyyy-MM-dd", null), DateTime.ParseExact(endDay, "yyyy-MM-dd", null), shopId);
                    break;
                default:
                    listViewStatistics = new List<StatisticsViewModel>();
                    break;
            }
            if (listViewStatistics.Count <= 0)
            {
                return Content("<p><b>Không tìm thấy dử liệu thống kê.</b></p>");
            }
            
            //Infomation list for chartjs
            ViewBag.listLables = listViewStatistics.Select(x => x.Data);
            ViewBag.listSales = listViewStatistics.Select(x => x.Revenue.ToString(CultureInfo.InvariantCulture));
            ViewBag.listNumber = listViewStatistics.Select(x => x.NumberOfBill.ToString());
            //infomation for table.
            //ViewBag.ListStatisticsViewModel = jsonSerialiser.Serialize(listViewStatistics.Select(x => new { Date = x.Date.ToString("dd-MM-yyyy"), Revenue= x.Revenue, NumberOfBill=x.NumberOfBill })).ToString();
            ViewBag.ListStatisticsViewModel = listViewStatistics.Select(data => new { data, flag = 0 });
            return View();
        }
    }
}