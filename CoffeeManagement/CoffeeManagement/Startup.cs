using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(CoffeeManagement.Startup))]
namespace CoffeeManagement
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
