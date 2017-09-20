using CoffeeManagement.Models;
using CoffeeManagement.Controllers.Repository; 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;  

namespace CoffeeManagement.Controllers.Service
{
    public class AspNetUserRoleService : BaseService<AspNetUserRoles>
    {
        private AspNetUserRoleRepository shopUserRP = new AspNetUserRoleRepository(); 
        internal bool AddShopUser(AspNetUserRoles temp)
        {
            shopUserRP.Insert(temp);
            try
            {
                shopUserRP.Save();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        
        public new List<AspNetUserRoles> GetAll()
        {
            List<AspNetUserRoles> lst = base.GetAll().Where(p => p.RoleId != 2 && p.IsDelete == false).ToList();

            return lst; 
        }

        internal bool DeleteUser(int iD)
        {
            AspNetUserRoles temp = shopUserRP.SelectById(iD); 
            temp.IsDelete = true;
            try
            {
                shopUserRP.Save();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}