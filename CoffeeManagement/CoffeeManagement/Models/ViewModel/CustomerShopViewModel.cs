using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Models.ViewModel
{
    public class CustomerShopViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }     
        public string PhoneNumber { get; set; }
        public string Identity { get; set; }            
        public Nullable<System.DateTime> BirthDay { get; set; }
        public string Sex { get; set; }          
        public Nullable<int> ShopUserId { get; set; }

        public Nullable<int> ShopId { get; set; }

        public string ShopName { get; set; }
     
    }
}