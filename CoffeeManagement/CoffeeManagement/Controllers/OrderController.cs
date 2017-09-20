using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Web.Mvc;
using CoffeeManagement.Controllers.Service.OrderManagement;
using CoffeeManagement.Models.ViewModel;
using CoffeeManagement.Helpers;

namespace CoffeeManagement.Controllers
{
    public class OrderController : Controller
    {
        private readonly IOrderProductService _orderProductService;
        private readonly IOrderService _orderService;

        public OrderController(IOrderProductService orderProductService, IOrderService orderService)
        {
            _orderProductService = orderProductService;
            _orderService = orderService;
        }
        

        /// <summary>
        /// Page Order for Chef with number order
        /// </summary>
        /// <param name="count">
        /// Count default 20, 
        /// </param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult OrderForChef(int count = 20)
        {
            var shopId = this.GetShopId();
            var lstOrder = _orderService.GetOrderProductByStatus(new[] { "1", "2" }, shopId);
            var lstOrderProduct = _orderService.RenderOrderProductToViewModel(lstOrder);
            lstOrderProduct= _orderService.ShotByOrderId(lstOrderProduct);
            var lst = _orderService.GetListOrder(count, lstOrderProduct);
            return View(lst);
        }

        //1:Dang Lam, 2: Da Lam, 3: chua lam, 4:khong hoan thanh
        private static readonly List<string> Lst = new List<string>() { "Đang Làm", "Chưa Làm", "Đã Làm" };
        /// <summary>
        /// render a OrderProductModel for View
        /// </summary>
        /// <param name="od"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult PartialItem(OrderViewModel od)
        {
            var list = new List<string>(Lst);
            int b;
            if (!int.TryParse(od.Status, out b)) return null;
            list.RemoveAt(b - 1);
            ViewBag.status = list;
            ViewBag.ItemSatus = Lst[b - 1];
            if (ViewBag.ItemSatus == "Đang Làm")
            {
                ViewBag.Style = "";
                ViewBag.StyleSpan = "";
            }

            else if (ViewBag.ItemSatus == "Chưa Làm")
            {
                ViewBag.Style = "UserPanelCL";
                ViewBag.StyleSpan = "spanclCL";
            }
            else if (ViewBag.ItemSatus == "Đã Làm")
            {
                ViewBag.Style = "UserPanelHT";
                ViewBag.StyleSpan = "spanclHT";
            }
            else if (ViewBag.ItemSatus == "")
            {
                ViewBag.ItemSatus = "Đang Làm";
                ViewBag.Style = "";
                ViewBag.StyleSpan = "";
            }
            return PartialView(od);
        }

        [HttpGet]
        public bool ChangeStatusOrderProduct(string id, string status)
        {
            var shopId = this.GetShopId();
            var s = Lst.IndexOf(status)+1;
            var temp = _orderService.ChangeStatusOrderProduct(id, s.ToString(), shopId);
            return temp;
        }
        [HttpGet]
        public ActionResult PartialListOrder(List<OrderViewModel> listOrder)
        {
            return PartialView(listOrder);
        }
            

        /// <summary>
        /// update table when change final of OrderProductItem
        /// </summary>
        /// <param name="count">number of OrderProduct</param>
        /// <param name="id">id start</param>
        /// <param name="index">if index, this is get Oder start id +index</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult PartialUpdateTable(int count, int id,int index)
        {
            var shopId = this.GetShopId();
            if (count == 0)
            {
                return null;
            }
            var list = _orderService.UpdateTable(count, id,index, shopId);
            var lstOrderProduct = _orderService.RenderOrderProductToViewModel(list);
            lstOrderProduct = _orderService.ShotByOrderId(lstOrderProduct);
            return View(lstOrderProduct);
        }

        // GET: Order/Show
        [CustomAuthorize("Admin, Manager")]
        public ActionResult Show(DateTime? date = null)
        {
            return View(date);
        }

        /// <summary>
        /// Search order by field
        /// </summary>
        /// <param name="tableName">Table name</param>
        /// <param name="promotionName">Promotion Name</param>
        /// <param name="customerName">Customer name</param>
        /// <param name="createDate">Create at</param>
        /// <returns></returns>
        [CustomAuthorize("Admin,Manager")]
        public ActionResult Search(string tableName = null, string promotionName = null, string customerName = null, DateTime? createDate = null)
        {
            //get shopId when user loggin
            var shopId = this.GetShopId();
            var orderviews = _orderProductService.GetOrderView(createDate, shopId, tableName, promotionName, customerName);
            var listOv = new List<dynamic>();  // create list orderview object
            foreach (var item in orderviews)
            {
               
                listOv.Add(new
                {
                    data = new {
                        item.Id,
                        item.TableId,
                        item.TableName,
                        item.PromotionId,
                        item.PromotionName,
                        item.CustomerId,
                        item.CustomerName,
                        CreateDate = item.CreateDate.ToString("dd-MM-yyyy"),
                        item.Total
                },
                    flag = 0
                }
                );
            }
            return Json(listOv, JsonRequestBehavior.AllowGet);
        }
        [CustomAuthorize("Admin, Manager")]
        public ActionResult Detail(int orderId)
        {
            //get shopId when user loggin
            var shopId = this.GetShopId();
            var orderproduct = _orderProductService.GetOrderProduct(shopId, orderId);
            var listOp = new List<dynamic>();  // create list orderproduct
            foreach (var r in orderproduct)           
            {
                dynamic f = new ExpandoObject();
                f.Product_name = r.ProductName;
                f.TotalPrice = r.TotalPrice;
                f.Sale = r.Sale;
                f.Quantity = r.Quantity;
                switch (r.Status)
                {
                    case "1":
                        f.Status = "Đang Làm";
                        break;
                    case "2":
                        f.Status = "Chưa Làm";
                        break;
                    case "3":
                        f.Status = "Đã Làm";
                        break;
                    case "4":
                        f.Status = "Không Hoàn Thành";
                        break;
                    default:
                        f.Status = "Mới";
                        break;
                }
                listOp.Add(f);
            }
            return View(listOp);
        }
    }
}