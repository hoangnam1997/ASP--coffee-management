using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Controllers.Repository.UserManagement;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;

namespace CoffeeManagement.Controllers.Service.UserManagement
{
    public class UserService : BaseService<CoffeeManagement.Models.AspNetUsers>, IUserService
    {
        private IUserRepository _userRepository;
        private UserRepository userRP; 
        public UserService(IUserRepository baseRepo) : base(baseRepo)
        {
            _userRepository = baseRepo;
        }

        public UserService()
        {
            // TODO: Complete member initialization
        }

        public void EditedUser(AspNetUsers user)
        {
            _userRepository.EditedUser(user);
        }

        public IEnumerable<CustomerShopViewModel> GetListCustomer(int shopid)
        {
            return _userRepository.GetListCustomer(shopid);
        }

        public IEnumerable<CustomerShopViewModel> GetListCustomer()
        {
            return _userRepository.GetListCustomer();
        }

        public bool RemovedCustomer(int shopUserId)
        {
            return _userRepository.RemovedCustomer(shopUserId);
        }

        public string GetShopName(int shopid)
        {
            return _userRepository.GetShopName(shopid);
        }
    }
}