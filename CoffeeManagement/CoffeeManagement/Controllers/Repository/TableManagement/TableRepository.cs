using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Controllers.Repository
{
    /// <summary>
    /// Lớp cung cấp các hàm thêm, xoá, sửa, load dữ liệu đối với use case "Table Management"
    /// </summary>
    public class TableRepository : BaseRepository<Table>
    {
        /// <summary>
        /// Thực hiện lấy danh sách table theo Shop ID của shop đang sử dụng.
        /// </summary>
        /// <param name="shopID">Shop ID của shop hiện tại đang đăng nhập</param>
        /// <returns></returns>
        public List<Table> GetAllTable(int shopID)
        {
            List<Table> listTable = base.GetAll().Where(p => p.IsDelete == false && p.ShopID == shopID).ToList();

            return listTable;
        }
    }
}