using System.Web;
using System.Web.Mvc;

namespace CoffeeManagement.Helpers
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        private string[] AllowRoles;

        public CustomAuthorizeAttribute(string roles)
        {
            this.AllowRoles = roles.Split(',');
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            bool authorized = false;
            //search role of user
            foreach (var role in AllowRoles)
            {
                if (httpContext.User.IsInRole(role.Trim()))
                {
                    return true;
                }
            }
            return false;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new HttpUnauthorizedResult();
            //uncomment to redirect a page
            //filterContext.Result = new ViewResult {ViewName = "~/Views/Account/AccessDenied.cshtml"};
        }
    }
}