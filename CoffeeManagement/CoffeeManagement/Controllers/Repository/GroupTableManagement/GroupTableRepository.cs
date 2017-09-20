using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Controllers.Repository
{
    /// <summary>
    /// Lớp cung cấp phương thức thêm xóa sửa load dữ liệu cho use case Group Table Management
    /// </summary>
    public class GroupTableRepository : BaseRepository<GroupTable>
    {
        /// <summary>
        /// Lấy danh sách Group Table từ cơ sở dữ liệu
        /// </summary>
        /// <returns></returns>
        public List<GroupTable> GetAllGroupTable()
        {
            List<GroupTable> listGroupTable = base.GetAll().Where(p => p.IsDelete == false).ToList();
            return listGroupTable;
        }
    }
}