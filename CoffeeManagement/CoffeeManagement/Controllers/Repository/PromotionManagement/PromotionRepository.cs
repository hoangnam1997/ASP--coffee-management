using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Controllers.Repository.PromotionManagement
{
    public class PromotionRepository : BaseRepository<Promotion>
    {
        public List<Promotion> GetAllPromotion(int shopID)
        {
            List<Promotion> lst = GetAll().Where(p => p.IsDelete == false && p.ShopID == shopID).ToList();
            return lst;
        }
    }
}