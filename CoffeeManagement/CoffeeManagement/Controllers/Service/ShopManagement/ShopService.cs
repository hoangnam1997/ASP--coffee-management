using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;

namespace CoffeeManagement.Controllers.Service
{
    public class ShopService: BaseService<Shop>
    {
        /// <summary>
        /// Shop Repository
        /// </summary>
        ShopRepository _shopRepo = new ShopRepository();

        /// <summary>
        /// Get all shop
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Shop> GetAllShop()
        {
            return _shopRepo.GetAllShop();
        }

        /// <summary>
        /// Add a new shop
        /// </summary>
        /// <param name="shop"></param>
        /// <returns></returns>
        public new String Insert(Shop shop)
        {
            if (!Validate(shop))
            {
                return "0";
            }
            try
            {
                _shopRepo.Insert(shop);
                _shopRepo.Save();
                return shop.ID.ToString();
            } catch {
                return "0";
            }

        }

        /// <summary>
        /// Validate shop (Name and DetailAddress is not null or empty)
        /// </summary>
        /// <param name="shop"></param>
        /// <returns></returns>
        public bool Validate(Shop shop)
        {
            if (String.IsNullOrEmpty(shop.Name) || String.IsNullOrEmpty(shop.DetailAddress))
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Update selected shop
        /// </summary>
        /// <param name="shop"></param>
        /// <returns></returns>
        public new string Update(Shop shop)
        {
            if (!Validate(shop))
            {
                return "0";
            }
            try
            {
                _shopRepo.Update(shop);
                _shopRepo.Save();
                return "1";
            } catch
            {
                return "0";
            }
        }

        /// <summary>
        /// Delete a shop by Shop ID
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public string DeleteShop(int ID)
        {
            try
            {
                _shopRepo.DeleteShop(ID);
                return "1";
            } catch
            {
                return "0";
            }
        }

        /// <summary>
        /// Recover deleted shop
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public string RecoverShop(int ID)
        {
            try
            {
                _shopRepo.RecoverShop(ID);
                return "1";
            }
            catch
            {
                return "0";
            }
        }
    }
}