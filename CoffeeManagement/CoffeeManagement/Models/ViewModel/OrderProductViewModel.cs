using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Models.ViewModel
{
    public class OrderProductViewModel
    {
        public string ProductName { get; set; }
        public  float TotalPrice { get; set; }
        public float Sale { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
    }
}