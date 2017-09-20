using System.Collections.Generic;
using CoffeeManagement.Models;

namespace CoffeeManagement.Controllers.Service.AddressManagement
{
    public interface IDistrictService : IBaseService<District>
    {
        bool ContainWith(District entity, bool isDelete = false);
        IEnumerable<District> GetAll(bool isDelete);
        IEnumerable<District> SelectByCityID(int CityID);
    }
}
