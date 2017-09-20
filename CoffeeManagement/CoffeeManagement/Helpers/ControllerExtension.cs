using System;
using System.Web;
using System.Web.Mvc;

namespace CoffeeManagement.Helpers
{
    //alow get and set shopId in session
    public static class ControllerExtension
    {
        public static string ShopIdSession = "_shopId";
        public static void SetShopId(this Controller controller, object value)
        {
            controller.HttpContext.Response.Cookies.Add(new HttpCookie(ShopIdSession,value.ToString()));
        }

        public static int GetShopId(this Controller controller)
        {
            string result = controller.HttpContext.Request.Cookies.Get(ShopIdSession)?.Value;
            return result == null ? -1 : Int32.Parse(result);
        }

        public static void DeleteShopId(this Controller controller)
        {
            controller.HttpContext.Response.Cookies.Set(new HttpCookie(ShopIdSession, ""));
        }
    }
}