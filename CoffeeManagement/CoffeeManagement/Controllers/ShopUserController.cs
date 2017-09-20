using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Controllers.Service.AddressManagement;
using CoffeeManagement.Controllers.Service.UserManagement;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoffeeManagement.Controllers
{
    public class ShopUserController : Controller
    {
        //Khai báo các biến Service ban đầu
        private GalaxyCoffeeEntities db = new GalaxyCoffeeEntities();
        private AspNetUserRoleService shopUserSV = new AspNetUserRoleService();
        private AspNetRoleService roleSV = new AspNetRoleService();
        private UserService userSV = new UserService(); 
        private ShopService shopSV = new ShopService();
        private CityService citySV = new CityService();
        private DistrictService districtSV = new DistrictService();
        private WardService wardSV = new WardService();

        // GET: Employee
        public ActionResult Index()
        {
            //Truyền danh sách Shop User lên view
            List<AspNetUserRoles> listShopUser = shopUserSV.GetAll().ToList();
            return View(listShopUser);
        }

        //[HttpPost]
        //public string Edit(int id, string name, DateTime birthday, string identity, string phone, string description, string detailAddress)
        //{
        //    string result = "Fail";
        //    AspNetUsers temp = new AspNetUsers();
        //    temp.Id = id;
        //    temp.Name = name;
        //    temp.Description = description;
        //    temp.BirthDay = birthday;
        //    temp.Identity = identity;
        //    temp.PhoneNumber = phone;
        //    temp.DetailAddress = detailAddress; 
        //    if (userSV.UpdateUser(temp))
        //    {
        //        result = "Success";
        //    }
        //    return result;
        //}

        [HttpPost]
        public string DeleteUser(int ID)
        {
            string result = "Fail";
            if (shopUserSV.DeleteUser(ID))
            {
                result = "Success";
            }
            return result;
        }
        public ActionResult Register()
        {
            //truyền list shop, role, city list vào view
            List<AspNetRoles> listRole = roleSV.GetAll().ToList();
            ViewData["ListRole"] = listRole;
            List<Shop> listShop = shopSV.GetAll().ToList();
            ViewData["ListShop"] = listShop;
            List<City> listCity = citySV.GetAll().ToList();
            ViewData["ListCity"] = listCity;
            // chuyển hướng đến View register của account controller
            return RedirectToAction("Register", "Account");
        }
        public ActionResult GetDistrict(int ID)
        {
            List<District> listDistrict = districtSV.SelectByCityID(ID).ToList();
            return Json(listDistrict.Select(p => new { ID = p.ID, Name = p.Name }), JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetWard(int ID)
        {
            List<Ward> listWard = wardSV.GetByID(ID);
            return Json(listWard.Select(p => new { ID = p.ID, Name = p.Name }), JsonRequestBehavior.AllowGet);
        }
    }
}