using System.Collections.Generic;
using CoffeeManagement.Models;

namespace CoffeeManagement.Controllers.Service.AddressManagement
{
    public interface IWardService : IBaseService<Ward>
    {
        bool ContainWith(Ward entity,bool isDelete = false);
        bool Validate(Ward entity);

        /// <summary>
        /// Get list wardview
        /// </summary>
        /// <param name="isDelete">ward is deleted or not</param>
        /// <returns></returns>
        IEnumerable<WardViewModel> GetListWardView(bool isDelete);
    }
}