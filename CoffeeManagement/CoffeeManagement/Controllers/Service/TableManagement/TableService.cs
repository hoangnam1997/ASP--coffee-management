using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeManagement.Controllers.Service
{
    /// <summary>
    /// Lớp cung cấp các phương thức validate dữ liệu và xử lý nghiệp vụ đối với use case "Table Management"
    /// </summary>
    public class TableService : BaseService<Table>
    {
        private TableRepository _tableRepo = new TableRepository(); // Biến đại diện cho lớp Repository tương ứng.

        /// <summary>
        /// Thực hiện lấy danh sách table theo Shop ID của shop đang sử dụng.
        /// </summary>
        /// <param name="shopID">Shop ID của shop hiện tại đang đăng nhập</param>
        /// <returns></returns>
        public List<Table> GetAllTable(int shopID)
        {
            return _tableRepo.GetAllTable(shopID);
        }

        /// <summary>
        /// Thực hiện Validate dữ liệu của table được gửi vào.
        /// Trả về true nếu validate thành công. Ngược lại trả về false.
        /// </summary>
        /// <param name="newTable">Table cần validate</param>
        /// <returns></returns>
        public bool ValidateTableInfo(Table newTable)
        {
            if (newTable.Name.CompareTo(string.Empty) == 0) // kiểm tra Name có rỗng hay không
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        /// <summary>
        /// Thực hiện thêm dữ liệu table được gửi vào vào CSDL.
        /// Trả về true nếu thêm thành công. Ngược lại trả về false.
        /// </summary>
        /// <param name="newTable">table cần thêm vào CSDL</param>
        /// <returns></returns>
        public bool AddTable(Table newTable)
        {
            _tableRepo.Insert(newTable); // Thêm table vào entity

            try
            {
                _tableRepo.Save(); // thực hiện lưu xuống CSDL
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Thực hiện update dữ liệu của table được gửi vào vào CSDL.
        /// Trả về true nếu update thành công. Ngược lại trả về false.
        /// </summary>
        /// <param name="newTable">table cần update</param>
        /// <returns></returns>
        public bool UpdateTable(Table newTable)
        {
            _tableRepo.Update(newTable);

            try
            {
                _tableRepo.Save();
            }
            catch(Exception e)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Thực hiện update trường IsDelete = true của table có ID tương ứng.
        /// Trả về true nếu update thành công. Ngược lại trả về false.
        /// </summary>
        /// <param name="ID">ID của table cần delete</param>
        /// <returns></returns>
        public bool DeleteTable(int ID)
        {
            Table tableDelete = _tableRepo.SelectById(ID); // Lấy Table có ID tương ứng cần xoá
            tableDelete.IsDelete = true; // thực hiện xoá

            try
            {
                _tableRepo.Save();
            }
            catch (Exception e)
            {
                return false;
            }

            return true;
        }
    }
}