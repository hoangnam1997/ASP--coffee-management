using CoffeeManagement.Models;
using System.Collections.Generic;

namespace CoffeeManagement.Controllers.Repository
{
    public interface IWardRepository : IBaseRepository<Ward>
    {       IEnumerable<Ward> SelectByDistrictID(int DistrictID);
    }

    
}