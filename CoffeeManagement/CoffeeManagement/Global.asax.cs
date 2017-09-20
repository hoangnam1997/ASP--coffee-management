using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace CoffeeManagement
{
    public class CoffeeApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            DIContainer.Configure();
        }
    }
}
