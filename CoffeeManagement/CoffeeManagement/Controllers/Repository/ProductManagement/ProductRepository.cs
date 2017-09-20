using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Models;

namespace CoffeeManagement.Controllers.Repository
{
    public class ProductRepository:BaseRepository<Product>
    {
        public List<Product> Search(string name)
        {
            if (string.IsNullOrEmpty(name)) return null;

            var products = this.GetAll();

            var search = products.Where(product => product.Name.ToLower().Contains(name.ToLower())).ToList();

            return search;
        }

        public List<Product> GetAllProduct(int ShopID)
        {
            List<Product> lst = base.GetAll().Where(p => p.IsDelete == false && p.ShopID == ShopID).ToList();

            return lst;
        }
    }
}