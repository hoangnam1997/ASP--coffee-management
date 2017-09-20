using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Controllers.Service;

namespace CoffeeManagement.Controllers.Service
{
    public class ProductCategoryService : BaseService<ProductCategory>
    {
        private ProductCategoryRepository _productCategoryRepo = new ProductCategoryRepository();

        public bool ValidateProductCategoryInfo(ProductCategory productCategoryInfo)
        {
            if (productCategoryInfo.Name.CompareTo(string.Empty) == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public int AddProductCategory(ProductCategory productCategory)
        {
            _productCategoryRepo.Insert(productCategory);
            try
            {
                _productCategoryRepo.Save();
                return productCategory.ID;
            }
            catch (Exception)
            {

                return -1;
            }
        }
        public bool UpdateProductCategory(ProductCategory productCategory)
        {
            _productCategoryRepo.Update(productCategory);

            try
            {
                _productCategoryRepo.Save();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
        public bool DeleteProductCategory(int ID)
        {
            ProductCategory temp = _productCategoryRepo.SelectById(ID);
            temp.IsDelete = true;
            try
            {
                _productCategoryRepo.Save();
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

    }
}