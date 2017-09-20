using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CoffeeManagement.Models.ViewModel
{
    public class UserViewModel
    {
        public string Name { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int WardID { get; set; }
        public string DetailAddress { get; set; }
        public Nullable<System.DateTime> BirthDay { get; set; }
        public string Sex { get; set; }
        public string Description { get; set; }
    }
}