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
    
    public partial class GroupTable
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public GroupTable()
        {
            this.Table = new HashSet<Table>();
            IsDelete = false;
        }
    
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Surcharge { get; set; }
        public Nullable<bool> IsDelete { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Table> Table { get; set; }
    }
}
