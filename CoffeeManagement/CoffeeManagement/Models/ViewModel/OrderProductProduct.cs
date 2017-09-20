using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Models.ViewModel
{
    public class OrderProductProduct
    {
        public int OrderId { get; set; }
        public int OrderProductId { get; set; }
        public int ProductId { get; set; }
        public int TableId { get; set; }
        public string ProductName { get; set; }
        public string Image { get; set; }
        public string Status { get; set; }
        public DateTime? CreateAt { get; set; }
    }
}