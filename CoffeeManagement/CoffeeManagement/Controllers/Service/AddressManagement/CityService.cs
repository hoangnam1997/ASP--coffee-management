using System.Collections.Generic;
using System.Linq;
using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;

namespace CoffeeManagement.Controllers.Service.AddressManagement
{
    public class CityService : BaseService<City>,ICityService
    {
        private ICityRepository _repo;

        public CityService(ICityRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public CityService() : base() { }

        public IEnumerable<City> GetAll(bool isDelete)
        {
            return _repo.GetAll().Where(x => x.IsDelete == isDelete);
        }
    }
}