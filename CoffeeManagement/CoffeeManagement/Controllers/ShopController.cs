using CoffeeManagement.Controllers.Service.AddressManagement;
using CoffeeManagement.Helpers;
using CoffeeManagement.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using CoffeeManagement.Controllers.Service;

namespace CoffeeManagement.Controllers
{
    [CustomAuthorize("Admin")]
    public class ShopController : Controller
    {
        private ShopService _shopService = new ShopService();
        private CityService _cityService = new CityService();
        private DistrictService _districtService = new DistrictService();
        private WardService _wardService = new WardService();
        // GET: Shop
        public ActionResult Index()
        {
            var ls = _shopService.GetAllShop();
            ViewData["cities"] = _cityService.GetAll();
            return View(ls);
        }

        /// <summary>
        /// Select all districts by CityID
        /// </summary>
        /// <param name="CityID"></param>
        /// <returns></returns>
        public JsonResult ShowDistrict(int CityID)
        {
            var districts = _districtService.SelectByCityID(CityID).Select(d => new { ID = d.ID, Name = d.Name});
            return Json(districts, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Select all wards by DistrictID
        /// </summary>
        /// <param name="DistrictID"></param>
        /// <returns></returns>
        public JsonResult ShowWard(int DistrictID)
        {
            var wards = _wardService.SelectByDistrictID(DistrictID).Select(w => new { ID = w.ID, Name = w.Name });
            return Json(wards, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Add a new shop
        /// </summary>
        /// <param name="Name"></param>
        /// <param name="DetailAddress"></param>
        /// <param name="WardID"></param>
        /// <param name="Description"></param>
        /// <returns></returns>
        public String AddShop(Shop shop)
        {
            return _shopService.Insert(shop);
        }

        /// <summary>
        /// Update shop
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="Name"></param>
        /// <param name="DetailAddress"></param>
        /// <param name="WardID"></param>
        /// <param name="Description"></param>
        /// <returns></returns>
        public String UpdateShop(Shop shop)
        {
            return _shopService.Update(shop);
        }

        /// <summary>
        /// Delete shop
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public String DeleteShop(int ID)
        {
            return _shopService.DeleteShop(ID);
        }

        public String RecoverShop(int ID)
        {
            return _shopService.RecoverShop(ID);
        }
    }
}