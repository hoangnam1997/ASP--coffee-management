using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Helpers;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoffeeManagement.Controllers
{
    // Customize user
    [CustomAuthorize("Admin, Manager")]
    public class ProductCategoryController : Controller
    {
        private ProductCategoryService _productCategoryService = new ProductCategoryService();
        private List<ProductCategory> listProductCategory;
        //
        // GET: /ProductCategory/
        public ActionResult Index()
        {
            listProductCategory = _productCategoryService.GetAll().ToList();
            // Check language not use anymore
            if (Session["language"] == null)
            {
                Session["language"] = "en_US.js";
            }
            return View(listProductCategory);
        }
        [HttpPost]
        // Not use
        public JsonResult GetList() {
            return Json(listProductCategory, JsonRequestBehavior.AllowGet);
        }
        // Add Product Category
        [HttpPost]
        public string AddProductCategory(ProductCategory productCategory)
        {
            // Validate and Add to Database
            if (_productCategoryService.ValidateProductCategoryInfo(productCategory) == true)
            {
                return _productCategoryService.AddProductCategory(productCategory).ToString();
            }
            else
            {
                return "-1";
            }
        }
        // Delete Product Category
        [HttpPost]
        public string DeleteProductCategory(int ID)
        {
            string result = "Fail";
            // Just update isDelete in Product Category not delete
            if (_productCategoryService.DeleteProductCategory(ID))
            {
                result = "Success";
            }

            return result;
        }
        // Update ProductCategory
        [HttpPost]
        public string UpdateProductCategory(ProductCategory productCategory)
        {
            string result = "Fail";
            if (_productCategoryService.UpdateProductCategory(productCategory))
            {
                result = "Success";
            }

            return result;
        }
        // Change Language - Not use
        [HttpPost]
        public string ChangeLanguage(string language)
        {
            if (Session["language"] == null)
            {
                Session["language"] = "en_US.js";
                return "Fail";
            }
            else
            {
                Session["language"] = language;
                return "Success";
            }
            return "Success";
        }
	}
}