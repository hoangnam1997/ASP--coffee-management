using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using System.Collections.Generic;
using System.Linq;

namespace CoffeeManagement.Controllers.Service.AddressManagement
{
    public class DistrictService : BaseService<District>, IDistrictService
    {
        private IDistrictRepository _repo;

        public DistrictService(IDistrictRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public DistrictService(): base() { }

        DistrictRepository _districtRepository = new DistrictRepository();

        public IEnumerable<District> SelectByCityID(int CityID)
        {
            return _districtRepository.SelectByCityID(CityID);
        }

        public bool ContainWith(District entity, bool isDelete = false)
        {
            var result = _repo.GetAll().Where(d => d.Name.ToUpper() == entity.Name.ToUpper() &&
                                                   d.CityID == entity.CityID &&
                                                   d.IsDelete == isDelete);
            return result.SingleOrDefault() != null;
        }

        public IEnumerable<District> GetAll(bool isDelete)
        {
            return _repo.GetAll().Where(x => x.IsDelete == isDelete);
        }
    }
}