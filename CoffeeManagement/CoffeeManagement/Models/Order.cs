//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CoffeeManagement.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Order
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Order()
        {
            this.OrderProduct = new HashSet<OrderProduct>();
            IsDelete = false;
        }
    
        public int ID { get; set; }
        public int TableID { get; set; }
        public Nullable<int> PromotionID { get; set; }
        public int UserID { get; set; }
        public Nullable<System.DateTime> CreateAt { get; set; }
        public Nullable<bool> IsDelete { get; set; }
    
        public virtual AspNetUsers AspNetUsers { get; set; }
        public virtual Promotion Promotion { get; set; }
        public virtual Table Table { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<OrderProduct> OrderProduct { get; set; }
    }
}
