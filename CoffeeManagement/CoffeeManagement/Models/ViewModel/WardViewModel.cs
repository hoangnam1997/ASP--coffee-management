using System.ComponentModel;

namespace CoffeeManagement.Models
{
    public class WardViewModel
    {
        public int Id { get; set; }
        [DisplayName("Phường/Xã")]
        public string WardName { get; set; }
        [DisplayName("Quận/Huyện")]
        public string DistrictName { get; set; }
        public int DistrictId { get; set; }
        [DisplayName("Tỉnh/Thành Phố")]
        public string CityName { get; set; }
        public int CityId { get; set; }
    }
}