using CoffeeManagement.Controllers.Repository.PromotionManagement;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Controllers.Service.PromotionManagement
{
    public class PromotionService : BaseService<Promotion>
    {
        private PromotionRepository _PromotionRepo = new PromotionRepository();
        public List<Promotion> GetAllPromotion(int shopID)
        {
            return _PromotionRepo.GetAllPromotion(shopID);
        }

        /// <summary>
        /// Validate Data before Add or Update Promotion
        /// </summary>
        /// <param name="promotion"></param>
        /// <returns></returns>
        public bool ValidateData(Promotion promotion)
        {
            if (promotion.Name.CompareTo(string.Empty) == 0)
            { return false; }
            return true;
        }

        public bool AddPromotion(Promotion promotion)
        {

            _PromotionRepo.Insert(promotion);
            try
            {
                _PromotionRepo.Save();
            }
            catch (Exception)
            {

                return false;
            }
            return true;
        }

        public bool UpdatePromotion(Promotion promotion)
        {

            _PromotionRepo.Update(promotion);
            try
            {
                _PromotionRepo.Save();
            }
            catch (Exception)
            {

                return false;
            }
            return true;
        }

        public bool DeletePromotion(int ID)
        {
            Promotion pro = _PromotionRepo.SelectById(ID);
            pro.IsDelete = true;

            try
            {
                _PromotionRepo.Save();
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }
    }
}