using System;
using System.Collections.Generic;
using System.Linq;
using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Models;
using System.Collections.Generic;


namespace CoffeeManagement.Controllers.Service.AddressManagement
{
    public class WardService : BaseService<Ward>, IWardService
    {
        private IWardRepository _wardRepository;
        private IDistrictService _districtService;
        public WardService(IWardRepository repo, IDistrictService districtService) : base(repo)
        {
            _wardRepository = repo;
            _districtService = districtService;
        }

        public WardService() : base() { }

        private WardRepository _wardRepo = new WardRepository();

        public override void Insert(Ward entity)
        {
            base.Insert(entity);
            base.Save();
        }

        public override void Update(Ward entity)
        {
            base.Update(entity);
            base.Save();
        }

        //validate data before insert or update
        public bool Validate(Ward entity)
        {
            if (String.IsNullOrEmpty(entity.Name)) return false;
            if (_districtService.SelectById(entity.DistrictID) == null) return false;
            return true;
        }

        /// <summary>
        /// check ward is exist
        /// </summary>
        /// <param name="entity">ward information</param>
        /// <returns></returns>
        public bool ContainWith(Ward entity, bool isDelete = false)
        {
            var result = _wardRepository.GetAll().Where(x =>
                entity.Name.ToUpper() == x.Name.ToUpper() &&
                entity.DistrictID == x.DistrictID &&
                x.IsDelete == isDelete
            );

            return result.SingleOrDefault() != null;
        }
        private WardRepository WardRP = new WardRepository();
        internal List<Models.Ward> GetByID(int ID)
        {
            return WardRP.GetByID(ID);
        }

        /// <summary>
        /// Get list wardview
        /// </summary>
        /// <param name="isDelete">ward is deleted or not</param>
        /// <returns></returns>
        public IEnumerable<WardViewModel> GetListWardView(bool isDelete)
        {
            var wardList = _wardRepository.GetAll().Where(x => x.IsDelete == isDelete);
            var resultReturn = new List<WardViewModel>();
            foreach (var item in wardList)
            {
                resultReturn.Add( new WardViewModel()
                {
                    Id = item.ID,
                    WardName = item.Name,
                    DistrictId = item.District.ID,
                    DistrictName = item.District.Name,
                    CityId = item.District.City.ID,
                    CityName = item.District.City.Name
                });
            }
            return resultReturn;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="CityID"></param>
        /// <returns></returns>
        public IEnumerable<Ward> SelectByDistrictID(int DistrictID)
        {
            return _wardRepo.SelectByDistrictID(DistrictID);
        }
    }
}