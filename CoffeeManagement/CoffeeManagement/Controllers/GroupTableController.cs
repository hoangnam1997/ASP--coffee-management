using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Helpers;
using CoffeeManagement.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace CoffeeManagement.Controllers
{
    /// <summary>
    /// This class provides some methods to manage Group Table
    /// </summary>
    [CustomAuthorize("Admin,Manager")]
    public class GroupTableController : Controller
    {
        private GroupTableService groupTableService = new GroupTableService();
        private string result = Status.Fail.ToString();
        /// <summary>
        /// This method lists out group tables
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            List<GroupTable> listGroupTable = groupTableService.GetAllGroupTable();
            return View(listGroupTable);
        }

        /// <summary>
        /// This method is used to create a group table
        /// </summary>
        /// <param name="Name">Name của GroupTable khi tạo mới</param>
        /// <param name="Description">Description của GroupTable khi tạo mới</param>
        /// <param name="Surcharge">Surcharge của GroupTable khi tạo mới</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddGroupTable(string Name, string Description, long Surcharge)
        {
            GroupTable newGroupTable = new GroupTable();
            newGroupTable.Name = Name;
            newGroupTable.Description = Description;
            newGroupTable.Surcharge = Surcharge;

            if (groupTableService.ValidateGroupTableInfo(newGroupTable) == true)
            {
                if (groupTableService.AddGroupTable(newGroupTable) == true)
                {
                    result = Status.Success.ToString();
                }
            }

            return Json(new { Result = result, ID = newGroupTable.ID }, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// This method is used to edit a group table
        /// </summary>
        /// <param name="ID">ID của GroupTable cần update</param>
        /// <param name="Name"> Name mới khi update của GroupTable tương ứng</param>
        /// <param name="Description">Description mới khi update của GroupTable tương ứng</param>
        /// <param name="Surcharge">Surcharge mới khi update của GroupTable tương ứng</param>
        /// <returns></returns>
        [HttpPost]
        public string UpdateGroupTable(int ID, string Name, string Description, long Surcharge)
        {
            GroupTable newGroupTable = new GroupTable();
            newGroupTable.ID = ID;
            newGroupTable.Name = Name;
            newGroupTable.Description = Description;
            newGroupTable.Surcharge = Surcharge;

            if (groupTableService.ValidateGroupTableInfo(newGroupTable) == true)
            {
                if (groupTableService.UpdateGroupTable(newGroupTable) == true)
                {
                    result = Status.Success.ToString();
                }
            }
            return result;
        }


        /// <summary>
        /// Delete a Group Table based on ID
        /// </summary>
        /// <param name="ID">ID của GroupTable</param>
        /// <returns></returns>
        [HttpPost]
        public string DeleteGroupTable(int ID)
        {
            if (groupTableService.DeleteGroupTable(ID) == true)
            {
                result = Status.Success.ToString();
            }
            return result;
        }
    }
}