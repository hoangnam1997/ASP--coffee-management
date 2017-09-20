using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CoffeeManagement.Helpers;

namespace CoffeeManagement.Controllers
{
	[CustomAuthorize("Admin,Manager")]
    public class TableController : Controller
    {
        private TableService tableService = new TableService();
        private GroupTableService groupTableService = new GroupTableService();
        private Status result = Status.Fail;

        // GET: GroupTable
        public ActionResult Index()
        {
			List<Table> listTable = tableService.GetAllTable(this.GetShopId()); // sử dụng ShopID truyền từ HomeController
            List<GroupTable> listGroupTable = groupTableService.GetAllGroupTable();
			List<Table> lstTable = tableService.GetAllTable(this.GetShopId()); // sử dụng ShopID truyền từ HomeController
            List<GroupTable> lstGroupTable = groupTableService.GetAllGroupTable();

            ViewData["ListGroupTable"] = listGroupTable;
            ViewData["ShopID"] = this.GetShopId().ToString();

            return View(listTable);
        }

        /// <summary>
        /// Thực hiện thêm mới table với các thông tin được gửi từ client vào CSDL.
        /// </summary>
        /// <param name="Name">Name của table cần thêm mới</param>
        /// <param name="GroupTableID">GroupTableID của table cần thêm mới</param>
        /// <param name="ShopID">ShopID của shop đang sử dụng</param>
        /// <param name="Description">Mô tả (nếu có) của table cần thêm mới</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddTable(string Name, int GroupTableID, int ShopID, string Description)
        {
            result = Status.Fail;
            Table newTable = new Table();
            newTable.Name = Name;
            newTable.Description = Description;
            newTable.GroupTableID = GroupTableID;
            newTable.ShopID = ShopID;

            if (tableService.ValidateTableInfo(newTable) == true)
            {
                if (tableService.AddTable(newTable) == true)
                {
                    result = Status.Success;
                }
            }

            return Json(new { Result = result.ToString(), ID = newTable.ID }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Thực hiện cập nhật những thay đổi của table theo ID được gửi từ client.
        /// </summary>
        /// <param name="ID">ID của table cần update</param>
        /// <param name="Name">Name mới (nếu có thay đổi) của table tương ứng</param>
        /// <param name="GroupTableID">GroupTableID mới (nếu có thay đổi) của table tương ứng</param>
        /// <param name="ShopID">ShopID của shop đang sử dụng</param>
        /// <param name="Description">Description mới (nếu có thay đổi) của table tương ứng</param>
        /// <returns></returns>
        [HttpPost]
        public string UpdateTable(int ID, string Name, int GroupTableID, int ShopID, string Description)
        {
            result = Status.Fail;

            Table newTable = new Table();
            newTable.ID = ID;
            newTable.Name = Name;
            newTable.Description = Description;
            newTable.GroupTableID = GroupTableID;
            newTable.ShopID = ShopID;

            if (tableService.ValidateTableInfo(newTable) == true)
            {
                if (tableService.UpdateTable(newTable) == true)
                {
                    result = Status.Success;
                }
            }
            return result.ToString();
        }

        /// <summary>
        /// Thực hiện delete 1 table theo ID được gửi từ client.
        /// </summary>
        /// <param name="ID">ID của Table cần delete</param>
        /// <returns></returns>
        [HttpPost]
        public string DeleteTable(int ID)
        {
            result = Status.Fail;
            if (tableService.DeleteTable(ID) == true)
            {
                result = Status.Success;
            }
            return result.ToString();
        }
    }
}