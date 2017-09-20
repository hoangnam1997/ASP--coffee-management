using Autofac;
using Autofac.Integration.Mvc;
using CoffeeManagement.Controllers.Repository;
using CoffeeManagement.Controllers.Repository.OrderManagement;
using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Controllers.Service.OrderManagement;
using CoffeeManagement.Controllers.Service.UserManagement;
using CoffeeManagement.Controllers.Repository.UserManagement;
using CoffeeManagement.Models;
using System.Data.Entity;
using System.Web.Mvc;
using CoffeeManagement.Controllers.Service.AddressManagement;

namespace CoffeeManagement
{
    public static class DIContainer
    {
        public static IContainer Container;

        public static void Configure()
        {
            var builder = new ContainerBuilder();

            //register controller
            builder.RegisterControllers(typeof(CoffeeApplication).Assembly);

            //register model
            builder.RegisterType<GalaxyCoffeeEntities>().As<DbContext>().AsSelf();

            //register repository
            builder.RegisterType<CityRepository>().As<ICityRepository>();
            builder.RegisterType<DistrictRepository>().As<IDistrictRepository>();
            builder.RegisterType<WardRepository>().As<IWardRepository>();
            builder.RegisterType<OrderRepository>().As<IOrderRepository>();
            builder.RegisterType<OrderProductRepository>().As<IOrderProductRepository>();
            builder.RegisterType<UserRepository>().As<IUserRepository>();

            builder.RegisterGeneric(typeof(BaseRepository<>)).As(typeof(IBaseRepository<>));



            //register serice
            builder.RegisterType<CityService>().As<ICityService>().AsSelf();
            builder.RegisterType<DistrictService>().As<IDistrictService>().AsSelf();
            builder.RegisterType<WardService>().As<IWardService>().AsSelf();
            builder.RegisterType<OrderService>().As<IOrderService>();
            builder.RegisterType<OrderProductService>().As<IOrderProductService>();
            builder.RegisterType<UserService>().As<IUserService>();


            builder.RegisterGeneric(typeof(BaseService<>)).As(typeof(IBaseService<>));



            Container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(Container));

        }
    }
}