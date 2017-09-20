using System;


namespace CoffeeManagement.Models.ViewModel
{
    public class OrderViewModel
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