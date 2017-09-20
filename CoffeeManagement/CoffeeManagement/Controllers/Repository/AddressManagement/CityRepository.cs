using System;
using System.Collections.Generic;
using CoffeeManagement.Models;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace CoffeeManagement.Controllers.Repository
{
    public class CityRepository : BaseRepository<City>, ICityRepository
    {
        public CityRepository(GalaxyCoffeeEntities db) : base(db)
        {
        }
    }
}