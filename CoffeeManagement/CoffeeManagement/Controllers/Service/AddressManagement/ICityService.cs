using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeManagement.Controllers.Service.AddressManagement
{
    interface ICityService : IBaseService<City>
    {
        IEnumerable<City> GetAll(bool isDelete);
    }
}
