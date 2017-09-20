using CoffeeManagement.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace CoffeeManagement.Controllers.Repository
{
    public class DistrictRepository : BaseRepository<District>, IDistrictRepository
    {
        public DistrictRepository(GalaxyCoffeeEntities db) : base(db)
        {
            
        }

        public DistrictRepository() : base() { }

        public IEnumerable<District> SelectByCityID(int CityID)
        {
             return _table.Where(d => d.CityID == CityID && d.IsDelete == false);
        }
    }
}