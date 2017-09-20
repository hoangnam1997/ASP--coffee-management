using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;
namespace CoffeeManagement.Controllers.Repository.UserManagement
{
    public class UserRepository : BaseRepository<CoffeeManagement.Models.AspNetUsers>, IUserRepository
    {
        GalaxyCoffeeEntities db = new GalaxyCoffeeEntities();

        /// <summary>
        /// edit information a user
        /// </summary>
        /// <param name="user"></param>
        public void EditedUser(AspNetUsers user)
        {
            using (var context = new GalaxyCoffeeEntities())
            {
                string f1 = " Name = N'" + user.Name + "'";
                string f2 = ", Email = '" + user.Email + "'";
                string f3 = ", PhoneNumber = '" + user.PhoneNumber + "'";
                string f4 = ", [Identity] = '" + user.Identity + "'";
                string f5 = ", BirthDay = '" + user.BirthDay.Value.ToString("MM-dd-yyyy") + "'";
                string f6 = ", Sex = N'" + user.Sex + "'";
                string f7 = ", Description = N'" + user.Description + "'";
                string f8 = ", WardID = " + user.WardID.ToString();
                string f9 = ", DetailAddress = N'" + user.DetailAddress + "'";

                string query = "UPDATE AspNetUsers SET" + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8 + f9 + " WHERE Id = " + user.Id.ToString();
                context.Database.ExecuteSqlCommand(query);
            }
        }


        /// <summary>
        /// get list customer with shopid for role shop manager
        /// </summary>
        /// <param name="shopid"></param>
        /// <returns></returns>
        public IEnumerable<CustomerShopViewModel> GetListCustomer(int shopid)
        {

            var result = from u in db.AspNetUsers.Where(x => x.BirthDay != null && x.IsDelete != true)
                         join ur in db.AspNetUserRoles.Where(x => x.RoleId == 2 && x.IsDelete != true && x.ShopID == shopid) on u.Id equals ur.UserId
                         select new
                         {
                             Id = u.Id,
                             Name = u.Name,
                             Email = u.Email,
                             PhoneNumber = u.PhoneNumber,
                             Identity = u.Identity,
                             BirthDay = u.BirthDay,
                             Sex = u.Sex,
                             ShopUserId = ur.Id,
                             ShopId = ur.ShopID
                         };

            var res = from r in result
                      join x in db.Shop.Where(x => x.IsDelete != true) on r.ShopId equals x.ID into xs
                      from s in xs.DefaultIfEmpty()
                      select new CustomerShopViewModel
                      {
                          Id = r.Id,
                          Name = r.Name,
                          Email = r.Email,
                          PhoneNumber = r.PhoneNumber,
                          Identity = r.Identity,
                          BirthDay = r.BirthDay,
                          Sex = r.Sex,
                          ShopUserId = r.Id,
                          ShopId = s.ID,
                          ShopName = s.Name
                      };
            return res;
        }


        /// <summary>
        /// get list customer for admin
        /// </summary>
        /// <returns></returns>
        public IEnumerable<CustomerShopViewModel> GetListCustomer()
        {
        
            var result = from u in db.AspNetUsers.Where(x => x.BirthDay != null && x.IsDelete != true)
                         join ur in db.AspNetUserRoles.Where(x => x.RoleId == 2 && x.IsDelete != true) on u.Id equals ur.UserId into us
                         from s in us.DefaultIfEmpty()
                         select new{
                             Id = u.Id,
                             Name = u.Name,
                             Email = u.Email,
                             PhoneNumber = u.PhoneNumber,
                             Identity = u.Identity,
                             BirthDay = u.BirthDay,
                             Sex = u.Sex,
                             ShopUserId = s.Id,
                             ShopId = s.ShopID
                         };
                         
            var res = from r in result
                      join x in db.Shop.Where(x => x.IsDelete != true) on r.ShopId equals x.ID into xs
                      from s in xs.DefaultIfEmpty()
                      select new CustomerShopViewModel
                        {
                            Id = r.Id,
                            Name = r.Name,
                            Email = r.Email,
                            PhoneNumber = r.PhoneNumber,
                            Identity = r.Identity,
                            BirthDay = r.BirthDay,
                            Sex = r.Sex,
                            ShopUserId = r.Id,
                            ShopId = s.ID,
                            ShopName = s.Name
                        };
            return res;
        }


        /// <summary>
        /// remove a customer out of a shop
        /// </summary>
        /// <param name="shopUserId"></param>
        public bool RemovedCustomer(int shopUserId)
        {
            try
            {
                db.AspNetUserRoles.Find(shopUserId).IsDelete = true;
                db.SaveChanges();
                
                return true;
                                     
            }
            catch(Exception)
            {
                return false;
            }
                              
        }

        public string GetShopName(int shopid)
        {
            return db.Shop.Find(shopid).Name;
        }

    }
}