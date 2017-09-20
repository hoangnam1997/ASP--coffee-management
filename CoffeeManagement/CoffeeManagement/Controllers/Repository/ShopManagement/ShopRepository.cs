using CoffeeManagement.Models;
using System.Collections.Generic;
using System.Linq;

namespace CoffeeManagement.Controllers.Repository
{
    public class ShopRepository: BaseRepository<Shop>
    {
        /// <summary>
        /// Get All Shop
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Shop> GetAllShop()
        {
            return _db.Shop.Where(s => s.IsDelete == false);
        }

        /// <summary>
        /// Delete a shop by Shop ID
        /// </summary>
        /// <param name="ID"></param>
        public void DeleteShop(int ID)
        {
            var original = _db.Shop.Find(ID);
            original.IsDelete = true;
            _db.SaveChanges();
        }

        /// <summary>
        /// Recover deleted shop
        /// </summary>
        /// <param name="ID"></param>
        public void RecoverShop(int ID)
        {
            var shop = _db.Shop.Find(ID);
            shop.IsDelete = false;
            _db.SaveChanges();
        }
    }
}