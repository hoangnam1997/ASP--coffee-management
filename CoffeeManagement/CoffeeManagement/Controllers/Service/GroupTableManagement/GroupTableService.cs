using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Controllers.Service
{
    /// <summary>
    /// Cung cấp phương thức validate và xử lí nghiệp vụ dữ liệu đối với use case Group Table Management
    /// </summary>
    public class GroupTableService : BaseService<GroupTable>
    {
        
        private GroupTableRepository _gtableRepo = new GroupTableRepository();
        /// <summary>
        /// Thực hiện truy xuất danh sách của Group Table từ cơ sở dữ liệu
        /// </summary>
        /// <returns></returns>
        public List<GroupTable> GetAllGroupTable()
        {
            return _gtableRepo.GetAllGroupTable();
        }

        /// <summary>
        /// Thực hiện validate dữ liệu của Group Table được gửi vào
        /// Trả về true nếu validate thành công (ngược lại trả về false)
        /// </summary>
        /// <param name="newGroupTable"> Group Table cần validate</param> 
        /// <returns></returns>
        public bool ValidateGroupTableInfo(GroupTable newGroupTable)
        {
            if (newGroupTable.Name.CompareTo(string.Empty) == 0)
            {
                return false;
            }
            else if (newGroupTable.Surcharge <0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        /// <summary>
        /// Thực hiện add dữ liệu của Group Table được gửi vào vào cơ sở dữ liệu
        /// Trả về true nếu thêm thành công (ngược lại trả về false)
        /// </summary>
        /// <param name="newGroupTable">Group Table cần thêm</param>
        /// <returns></returns>
        public bool AddGroupTable(GroupTable newGroupTable)
        {
            _gtableRepo.Insert(newGroupTable);
            try
            {
                _gtableRepo.Save();
            }
            catch(Exception e)
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Thực hiện update dữ liệu của Group Table được gửi vào vào cơ sở dữ liệu
        /// Trả về true nếu update thành công (ngược lại trả về false)
        /// </summary>
        /// <param name="newGroupTable">Gorup Table cần update</param>
        /// <returns></returns>
        public bool UpdateGroupTable(GroupTable newGroupTable)
        {
            _gtableRepo.Update(newGroupTable);

            try
            {
                _gtableRepo.Save();
            }

            catch(Exception e)
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Thực hiện update trường IsDelete = true của Group Table vời ID tương ứng
        /// Trả về true nếu update thành công (ngược lại trả về false)
        /// </summary>
        /// <param name="ID">ID của Group Table cần Delete</param>
        /// <returns></returns>
        public bool DeleteGroupTable(int ID)
        {
            GroupTable groupTableDelete = _gtableRepo.SelectById(ID);
            groupTableDelete.IsDelete = true;

            try
            {
                _gtableRepo.Save();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
    }
}