using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;
using CoffeeManagement.Helpers;
using CoffeeManagement.Controllers.Repository.UserManagement;
using CoffeeManagement.Controllers.Service.UserManagement;
using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Controllers.Service.AddressManagement;

namespace CoffeeManagement.Controllers
{
    [CustomAuthorize("Admin, Manager")]
    public class UserController : Controller
    {            
        private UserService userService = new UserService(new UserRepository());

        private CityService cityService ;
        private WardService wardService ;
        private DistrictService districtService;
        IEnumerable<CustomerShopViewModel> users;
        public UserController(CityService city, DistrictService district, WardService ward)
        {         
            cityService = city;           
            districtService = district;
            wardService = ward;
        }

        public ActionResult Index(string sortOrder, string searchString, string currentFilter, int? page)
        {
            ViewBag.Name = userService.GetShopName(this.GetShopId());                    

            ViewBag.CurrentSort = sortOrder;
            ViewBag.NameSortParm = sortOrder == "name" ? "name_desc" : "name";
            ViewBag.DateSortParm = sortOrder == "date" ? "date_desc" : "date";

            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }
            ViewBag.CurrentFilter = searchString;




            if (User.IsInRole("Manager"))
            {
                users = userService.GetListCustomer(this.GetShopId());
            }
            else
            {
                users = userService.GetListCustomer();
            }


             

            if (!String.IsNullOrEmpty(searchString))
            {
                users = users.Where(s => s.Name.Contains(searchString)
                                       || s.Email.Contains(searchString)
                                       || s.Sex.Contains(searchString)
                                       || s.BirthDay.Value.ToString("yyyy-MM-dd").Contains(searchString)  
                                       || s.PhoneNumber.Contains(searchString));
            }

            switch (sortOrder)
            {
                case "name_desc":
                    users = users.OrderByDescending(s => s.Name);
                    break;
                case "date":
                    users = users.OrderBy(s => s.BirthDay);
                    break;
                case "date_desc":
                    users = users.OrderByDescending(s => s.BirthDay);
                    break;

                case "name":
                    users = users.OrderBy(s => s.Name);
                    break;
                default: 
                    users = users.OrderByDescending(s => s.ShopUserId);
                    break;
            }

            int pageSize = 5;
            int pageNumber = (page ?? 1);
            return View(users.ToPagedList(pageNumber, pageSize));              
        }


        /// <summary>
        /// Get list of user return data on table
        /// </summary>
        /// <returns></returns>
        public ActionResult ListUser(int? page)
        {
            

            if (User.IsInRole("Manager"))
            {
                users = userService.GetListCustomer(this.GetShopId());
            }
            else
            {
                users = userService.GetListCustomer();
            }
     
            int pageSize = 5;
            int pageNumber = (page ?? 1);
            return View(users.OrderByDescending(s => s.ShopUserId).ToPagedList(pageNumber, pageSize));
         
        }

        [HttpPost]
        public ActionResult Search(string searchString, int? page)
        {

            ViewBag.CurrentFilter = searchString;

            
            if (User.IsInRole("Manager"))
            {
                users = userService.GetListCustomer(this.GetShopId());
            }
            else
            {
                users = userService.GetListCustomer();
            }

            if (!String.IsNullOrEmpty(searchString))
            {
                users = users.Where(s => s.Name.Contains(searchString)
                                       || s.Email.Contains(searchString)
                                       || s.Sex.Contains(searchString)
                                       || s.BirthDay.Value.ToString("yyyy-MM-dd").Contains(searchString)  
                                       || s.PhoneNumber.Contains(searchString));
            }
            int pageSize = 5;
            int pageNumber = (page ?? 1);
            return View("~/Views/User/ListUser.cshtml", users.OrderBy(x => x.Name).ToPagedList(pageNumber, pageSize));
        }

        /// <summary>
        ///  Get list district follow city 
        /// </summary>
        /// <param name="cityid">cityid</param>
        /// <returns></returns>
        public ActionResult ListDistrict(int cityid)
        {
            ViewBag.ListDistrict = districtService.GetAll().Where(x => x.CityID == cityid);
            return View();
        }

        /// <summary>
        /// Get list ward follow district
        /// </summary>
        /// <param name="districtid"></param>
        /// <returns></returns>
        public ActionResult ListWard(int districtid)
        {
            ViewBag.ListWard = wardService.GetAll().Where(x => x.DistrictID == districtid);
            return View();
        }


        public ActionResult Create()
        {
            ViewBag.Cities = cityService.GetAll();
            ViewBag.Districts = districtService.GetAll().Where(x => x.CityID == 1);
            ViewBag.Wards = wardService.GetAll().Where(x => x.DistrictID == 1);
            return View();
        }

        

        /// <summary>
        /// Get the detail info about a user
        /// </summary>
        /// <param name="id"></param>
        /// <returns> a view for detail user info</returns>
        public ActionResult Detail(int id)
        {
            ViewBag.Detail = userService.SelectById(id);
            return View();
        }

        /// <summary>
        /// Remove a customer
        /// </summary>
        /// <param name="id"></param>
        [HttpPost]
        public ActionResult Removed(int shopUserId)
        {         
            return Json(new {res = userService.RemovedCustomer(shopUserId) });
        }


        public ActionResult Edit(int id)
        {
            ViewBag.Edit = userService.SelectById(id);
            ViewBag.Cities = cityService.GetAll();
            ViewBag.Districts = districtService.GetAll().Where(x => x.CityID == ViewBag.Edit.Ward.District.CityID);
            ViewBag.Wards = wardService.GetAll().Where(x => x.DistrictID == ViewBag.Edit.Ward.DistrictID);

            return View();
        }


        [HttpPost]
        public ActionResult Edited(AspNetUsers user)
        {
            if (ModelState.IsValid)
            {
                userService.EditedUser(user);
            }

            var result = userService.SelectById(user.Id);
            string _birthday = result.BirthDay.Value.ToString("yyyy-MM-dd");
            var set = new
            {
                result.Name,
                result.Email,
                result.Sex,
                BirthDay = _birthday,
                result.PhoneNumber
            };
            return Json(set, JsonRequestBehavior.AllowGet);
        }
    }
}