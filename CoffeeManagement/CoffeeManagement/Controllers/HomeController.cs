using CoffeeManagement.Helpers;
using System.Web.Mvc;

namespace CoffeeManagement.Controllers
{
    public class HomeController : Controller
    {
        [CustomAuthorize("Admin,Manager")]
        public ActionResult Index()
        {
            return View();
        }
    }
}