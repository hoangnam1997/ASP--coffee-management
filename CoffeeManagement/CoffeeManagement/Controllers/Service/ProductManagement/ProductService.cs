using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;

namespace CoffeeManagement.Controllers.Service
{
    public class ProductService:BaseService<Product>
    {
        private ProductRepository _productRepo = new ProductRepository();
        public List<Product> Search(string name)
        {
            return _productRepo.Search(name);
        }

        public int AddProduct(Product product)
        {
            _productRepo.Insert(product);
            try
            {
                _productRepo.Save();
                return product.ID;
            }
            catch (Exception)
            {
                return 0;
            }
        }
        public bool UpdateProduct(Product product)
        {
            _productRepo.Update(product);
            try
            {
                _productRepo.Save();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public bool DeleteProduct(int ID)
        {
            Product temp = _productRepo.SelectById(ID);
            temp.IsDelete = true;
            try
            {
                _productRepo.Save();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public List<Product> GetAllProduct(int ShopID)
        {
            return _productRepo.GetAllProduct(ShopID);
        }
        //validate Product name
        public bool ValidateProductInfo(Product newProduct)
        {
            if (newProduct.Name.CompareTo(string.Empty) == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

    }
}