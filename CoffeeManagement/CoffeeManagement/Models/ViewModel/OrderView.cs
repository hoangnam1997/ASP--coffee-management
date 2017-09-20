using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Models
{
    public class OrderView
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public string TableName { get; set; }
        public int PromotionId { get; set; }
        public string PromotionName { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public DateTime CreateDate { get; set; }
        public float Total { get; set; }
    }
}