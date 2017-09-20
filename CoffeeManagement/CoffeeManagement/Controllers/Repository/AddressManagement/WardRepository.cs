using CoffeeManagement.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq; 

namespace CoffeeManagement.Controllers.Repository
{
    public class WardRepository : BaseRepository<Ward>, IWardRepository
    {
        public WardRepository(GalaxyCoffeeEntities db) : base(db)
        {
            
        }
        internal List<Ward> GetByID(int ID)
        {
            
            var result = from c in _db.Ward where c.DistrictID == ID && c.IsDelete == false select c;
            return result.ToList();
        }
        public WardRepository(): base() { }

        public void DeleteWard(int ID)
        {
            var original = _db.Ward.Find(ID);
            original.IsDelete = true;
            //var ward = new Ward() { ID = ID, IsDeleted = true };
            //_db.Wards.Attach(ward);
            //_db.Entry(ward).Property(x => x.IsDeleted).IsModified = true;
            _db.SaveChanges();
        }

        public IEnumerable<Ward> SelectByDistrictID(int DistrictID)
        {
            return _table.Where(w => w.DistrictID == DistrictID && w.IsDelete == false);
        }

    }
}