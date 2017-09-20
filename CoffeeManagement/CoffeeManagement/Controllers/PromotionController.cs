using CoffeeManagement.Controllers.Service.PromotionManagement;
using CoffeeManagement.Helpers;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoffeeManagement.Controllers
{
    /// <summary>
    /// Index() :return List Promotion by ShopID
    /// AddPromotion() : Add Promotion into Database
    /// DeletePromotion() : Set Promotion.IsDelete = true
    /// UpdatePromotion() : Update Promotion into Database
    /// </summary>
    [CustomAuthorize("Admin,Manager")]
    public class PromotionController : Controller
    {
        private PromotionService promotionService = new PromotionService();
        // GET: Promotion

        public ActionResult Index()
        {
            var a = this.GetShopId();
            List<Promotion> lstPromotion = promotionService.GetAllPromotion(this.GetShopId()); // Get ShopID lấy từ HomeController
            ViewData["ShopID"] = this.GetShopId().ToString();
            return View(lstPromotion);
        }

        [HttpPost]
        public string AddPromotion(string name, int shopID, int discount, int basePurchase, DateTime startDate,   string description, DateTime? endDate = null)
        {
            string result = "Fail";
            Promotion tempPromotion = new Promotion();
            tempPromotion.Name = name;
            tempPromotion.ShopID = shopID;
            tempPromotion.Discount = discount;
            tempPromotion.BasePurchase = basePurchase;
            tempPromotion.StartDate = startDate;
            tempPromotion.EndDate = endDate;
            tempPromotion.Description = description;

            if (promotionService.ValidateData(tempPromotion))  // Check Validator 
            {
                if (promotionService.AddPromotion(tempPromotion) == true)
                {
                    result = tempPromotion.ID.ToString();
                }
            }
            return result;
        }
        public string UpdatePromotion(int id, string name, int shopID, int discount, int basePurchase, DateTime startDate, string description, DateTime? endDate = null)
        {
            string result = "fail";
            Promotion tempPromotion = new Promotion();
            tempPromotion.ID = id;
            tempPromotion.Name = name;
            tempPromotion.ShopID = shopID;
            tempPromotion.Discount = discount;
            tempPromotion.BasePurchase = basePurchase;
            tempPromotion.StartDate = startDate;
            tempPromotion.EndDate = endDate;
            tempPromotion.Description = description;

            if (promotionService.ValidateData(tempPromotion) == true)
            {
                if (promotionService.UpdatePromotion(tempPromotion) == true)
                {
                    result = "Success";
                }
            }

            return result;
        }
        [HttpPost]
        public string DeletePromotion(int id)
        {
            string result = "Fail";
            if (promotionService.DeletePromotion(id) == true)
            {
                result = "Success";
            }
            return result;
        }

    }
}