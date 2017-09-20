using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;
namespace CoffeeManagement.Controllers.Repository.UserManagement
{
    public interface IUserRepository : IBaseRepository<CoffeeManagement.Models.AspNetUsers>
    {
        void EditedUser(AspNetUsers user);

        IEnumerable<CustomerShopViewModel> GetListCustomer(int shopid);

        IEnumerable<CustomerShopViewModel> GetListCustomer();

        bool RemovedCustomer(int shopUserId);

        string GetShopName(int shopid);
    }
}