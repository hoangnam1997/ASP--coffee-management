using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Models; 

namespace CoffeeManagement.Controllers.Service
{
    public class AspNetRoleService  : BaseService<AspNetRoles>
    {
        public new List<AspNetRoles> GetAll()
        {
            List<AspNetRoles> list = base.GetAll().Where(p => p.Id != 2 && p.Id !=3 && p.Id !=  1).ToList();
            return list; 
        }
    }
}