using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace CoffeeManagement.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser<int,ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {
        public virtual string Name { get; set; }
        public virtual int WardId { get; set; }
        public virtual string DetailAddress { get; set; }
        public virtual string Identity { get; set; }
        public DateTime? BirthDay { get; set; }
        public string Sex { get; set; }
        public string Description { get; set; }
        public DateTime? CreateAt { get; set; }
        public bool IsDelete { get; set; }
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser,int> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser,ApplicationRole,int,ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {
        public ApplicationDbContext()
            : base("GalaxyCoffee2")
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }

    public class ApplicationUserRole : IdentityUserRole<int>
    {
        public int ShopID { get; set; }
        public string Description { get; set; }
        public bool IsDelete { get; set; }
    }

    public class ApplicationRole : IdentityRole<int, ApplicationUserRole>
    {
        public ApplicationRole() { }
        public ApplicationRole(string name)
        {
            Name = name;
        }
    }

    public class ApplicationUserClaim : IdentityUserClaim<int>
    {
        
    }

    public class ApplicationUserLogin : IdentityUserLogin<int> { }

    public class ApplicationUserStore : UserStore<ApplicationUser, ApplicationRole, int, ApplicationUserLogin, ApplicationUserRole,
        ApplicationUserClaim>
    {
        public ApplicationUserStore(ApplicationDbContext context) : base(context)
        {
        }
    }

    public class ApplicationRoleStore : RoleStore<ApplicationRole, int, ApplicationUserRole>
    {
        public ApplicationRoleStore(DbContext context) : base(context)
        {
        }

        public List<ApplicationUserRole> GetRoles(int userId)
        {
            return Context.Set<ApplicationUserRole>().Where(r => r.UserId == userId).ToList();
        }

        public static ApplicationRoleStore Create(IdentityFactoryOptions<ApplicationRoleStore> options,
            IOwinContext context)
        {
            return new ApplicationRoleStore(context.Get<ApplicationDbContext>());
        }
    }
}
