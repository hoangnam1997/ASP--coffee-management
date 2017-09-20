using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using CoffeeManagement.Controllers.Service;
using System.IO.Compression;
using System.Text;
using System.IO;
using System.Drawing;
using System.Globalization;
using CoffeeManagement.Helpers;

namespace CoffeeManagement.Controllers
{
    [CustomAuthorize("Admin,Manager")]
    public class ProductController : Controller
    {
        public GalaxyCoffeeEntities db = new GalaxyCoffeeEntities();
        public ProductService product_service = new ProductService();
        public ShopService shop_service = new ShopService();
        public ProductCategoryService PC_service = new ProductCategoryService();         
        

        // GET: Product Category
        public ActionResult Index()
        {
            
            List<Product> lst_product = product_service.GetAllProduct(this.GetShopId());
           // List<Shop> lst_shop = shop_service.GetAll().ToList();
            List<ProductCategory> lst_procate = PC_service.GetAll().ToList();
            //ViewData["Shop"] = lst_shop;
            ViewData["ProductCategory"] = lst_procate;
             return View(lst_product);
        }

        // Add Product
        [HttpPost]
        public JsonResult AddProduct(Product product)
        {
            product.Image = CreateImage(product.Image);
            product.StartDay = (DateTime)product.StartDay;
            product.EndDate = (DateTime)product.EndDate;
            product.UnitPrice = (decimal)product.UnitPrice;
            product.ShopID = this.GetShopId();

            
            if (product_service.ValidateProductInfo(product) == true)
            {
                if (product.Image != null)
                {
                    return Json(new { ID = product_service.AddProduct(product).ToString(), img = product.Image }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { ID = "0", img = "" }, JsonRequestBehavior.AllowGet); ;
        }
        
        //create Image
        public string CreateImage(string Image) {
            try
            {
                var data = Image.Substring(Image.IndexOf(",") + 1);
                var newfile = Convert.FromBase64String(data);
                var layoutfilename = Guid.NewGuid().ToString() + "_layout.png";
                System.IO.File.Create(Server.MapPath(@"~/Images/" + layoutfilename)).Close();
                var dataFile = Server.MapPath(@"~/Images/" + layoutfilename);
                System.IO.File.WriteAllBytes(dataFile, newfile);
                return layoutfilename;
            }
            catch (Exception)
            {
                return null;
            }
        }

        //Delete Product
        [HttpPost]
        public string DeleteProduct(int ID)
        {
            string result = "Fail";
            //Product temp = new Product();
            //temp.ID = ID;
            //temp.Name = Name;
            //temp.Description = Description;
            //temp.ShopID = ShopID;
            //temp.ProductCategoryID = ProductCategoryID;
            //temp.Discount = Discount;
            //temp.UnitPrice = Price;
            //temp.StartDay = StartDay;
            //temp.EndDate = EndDay;
            //temp.IsDelete = true;
            //temp.Image = Image;
            if (product_service.DeleteProduct(ID))
            {
                result = "Success";
            }
            return result;
        }

        //Update Product With out Image
        [HttpPost]
        public string UpdateProductWithoutImage(Product product)
        {
            string result = "Fail";
            product.StartDay = (DateTime)product.StartDay;
            product.EndDate = (DateTime)product.EndDate;
            product.UnitPrice = (decimal)product.UnitPrice;
            product.ShopID = this.GetShopId();
            if (product_service.UpdateProduct(product))
            {
                result = "Success";
            }
            return result;
        }

        //Update Product With Image
        [HttpPost]
        public string UpdateProductWithImage(Product product)
        {
            string result = "Fail";
            product.Image = CreateImage(product.Image);
            product.StartDay = (DateTime)product.StartDay;
            product.EndDate = (DateTime)product.EndDate;
            product.UnitPrice = (decimal)product.UnitPrice;
            product.ShopID = this.GetShopId();
            //string layoutname = CreateImage(Image);
            //temp.Image = layoutname;

            if (product_service.UpdateProduct(product))
            {
                result = product.Image;
            }
            return result;
        }
    }
}