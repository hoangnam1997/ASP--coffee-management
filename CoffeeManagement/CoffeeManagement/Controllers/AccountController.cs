using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using CoffeeManagement.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using CoffeeManagement.Models;
using CoffeeManagement.Models.ViewModel;
using CoffeeManagement.Controllers.Service;
using CoffeeManagement.Controllers.Service.AddressManagement;
using System.Collections.Generic;
using System.Linq; 

namespace CoffeeManagement.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        //Khai báo cáo biến kết nối với Service
        private GalaxyCoffeeEntities db = new GalaxyCoffeeEntities();
        private AspNetUserRoleService shopUserSV = new AspNetUserRoleService();
        private AspNetRoleService roleSV = new AspNetRoleService();
        private ShopService shopSV = new ShopService();
        private CityService citySV = new CityService();
        private DistrictService districtSV = new DistrictService();
        private WardService wardSV = new WardService(); 
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationRoleStore _roleStore;
        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, ApplicationRoleStore roleStore )
        {
            UserManager = userManager;
            SignInManager = signInManager;
            _roleStore = roleStore;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ApplicationRoleStore RoleStore
        {
            get { return _roleStore ?? HttpContext.GetOwinContext().Get<ApplicationRoleStore>(); }
            private set { _roleStore = value; }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            //check sign in
            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);
            var user = UserManager.FindByEmail(model.Email);
            switch (result)
            {
                case SignInStatus.Success:
                    //get shopid
                    //get role with current user
                    var roles = RoleStore.GetRoles(user.Id);
                    foreach (var r in roles)
                    {
                        //get roles of user in shop
                        var userRole = await RoleStore.FindByIdAsync(r.RoleId);
                        //allow only user have role below
                        if (userRole.Name == "Admin" || userRole.Name == "Manager" || 
                            userRole.Name =="Cashier" || userRole.Name == "Chef")
                        {
                            this.SetShopId(r.ShopID);
                            break;
                        }
                    }
                    return RedirectToLocal(returnUrl);

                case SignInStatus.LockedOut:
                    var time = await UserManager.GetLockoutEndDateAsync(user.Id);
                    ModelState.AddModelError("", String.Format("Bạn phải chờ {0}s, mới được login lại", (int)(time.ToLocalTime() - DateTime.Now.ToLocalTime()).TotalSeconds));
                    return View(model);

                case SignInStatus.Failure:
                default:
                    
                    if (user == null)
                    {
                        ModelState.AddModelError("", String.Format("{0} Không tồn tại", model.Email));
                    }
                    else
                    {
                        var count = UserManager.GetAccessFailedCount(user.Id);
                        ModelState.AddModelError("", String.Format("Đăng nhập thất bại {0} lần", count));
                    }
                    return View(model);
            }
        }

        //Hàm đăng ký
        [AllowAnonymous]
        public ActionResult Register()
        {
            //Lấy từ database danh sách Role, Shop, và City 
            List<AspNetRoles> listRole = roleSV.GetAll().ToList();
            ViewData["ListRole"] = listRole;
            List<Shop> listShop = shopSV.GetAll().ToList();
            ViewData["ListShop"] = listShop;
            List<City> listCity = citySV.GetAll().ToList();
            ViewData["ListCity"] = listCity;
            return View();
        }

        //Sau khi chọn City, sẽ lấy từ database các District ứng với City đó theo Id
        public ActionResult GetDistrict(int ID)
        {
            List<District> listDistrict = districtSV.SelectByCityID(ID).ToList();
            return Json(listDistrict.Select(p => new { ID = p.ID, Name = p.Name }), JsonRequestBehavior.AllowGet);
        }

        //Sau khi chọn District, sẽ lấy từ database các Ward ứng với District đó theo Id
        public ActionResult GetWard(int ID)
        {
            List<Ward> listWard = wardSV.GetByID(ID);
            return Json(listWard.Select(p => new { ID = p.ID, Name = p.Name }), JsonRequestBehavior.AllowGet);
        }

        // POST: /Account/Register
        //Hàm đăng ký xử lý khi nhấn vào nút đăng ký
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                //Tạo biến user theo class ApplicationUser, truyền các giá trị của model nhập từ form vào 
                var user = new ApplicationUser
                {
                    IsDelete = false,
                    Name = model.Name,
                    UserName = model.Email,
                    BirthDay = model.Birthday,
                    Sex = model.Sex,
                    Identity = model.Identity,
                    PhoneNumber = model.PhoneNumber.ToString(),
                    Email = model.Email,
                    WardId = model.WardID,
                    DetailAddress = model.DetailAddress,
                    Description = model.Description,
                    CreateAt = DateTime.Now,
                };
                //Tạo một tài khản mới  vào database AspNetUsers
                var result = await UserManager.CreateAsync(user, model.Password);
                //Khi tạo thành công sẽ tiến hành đăng nhập, và thêm dữ liệu vào database AspNetUserRole
                if (result.Succeeded)
                {
                    //đăng nhập vào hệ thống
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");
                    AspNetUserRoles temp = new AspNetUserRoles(); //Khởi tạo một biến temp từ class AspNetUserRole Model
                    temp.RoleId = model.Role;
                    temp.ShopID = model.ShopID;
                    temp.UserId = user.Id;
                    temp.IsDelete = false;
                    shopUserSV.AddShopUser(temp); //Thêm vào AspNetUserRole
                    //trở về view Index của ShopUserController
                    return RedirectToAction("Index", "ShopUser");
                }
                //Trường hợp khi thêm thất bại, ct sẽ add các lỗi trở lại form thông báo cho người dùng
                AddErrors(result);
            }
            //Lấy từ database danh sách Role, Shop, và City 
            List<AspNetRoles> listRole = roleSV.GetAll().ToList();
            ViewData["ListRole"] = listRole;
            List<Shop> listShop = shopSV.GetAll().ToList();
            ViewData["ListShop"] = listShop;
            List<City> listCity = citySV.GetAll().ToList();
            ViewData["ListCity"] = listCity;
            // If we got this far, something failed, redisplay form
            return View();
        }

        // POST: /Account/RegisterUser
        [HttpPost]
        [CustomAuthorize("Admin, Manager")]
        public async Task<ActionResult> RegisterCustomer(UserViewModel model)
        {          
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.Name,
                    Name = model.Name,
                    BirthDay = model.BirthDay,
                    Sex = model.Sex,
                    PhoneNumber = model.PhoneNumber.ToString(),
                    Email = model.Email,
                    WardId = model.WardID,
                    DetailAddress = model.DetailAddress,
                    CreateAt = DateTime.Now,
                    IsDelete = false,
                };

                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    AspNetUserRoles temp = new AspNetUserRoles();              
                    temp.ShopID = this.GetShopId();
                    temp.UserId = user.Id;
                    temp.RoleId = 2;
                    temp.IsDelete = false;
                    shopUserSV.AddShopUser(temp);
                    return Json(new { flag = true });
                }
                return Json(new { flag = false });
            }
            return Json(new { flag = false });
        }


        /* allow register user. Uncomment if you need this feature
        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email,WardId = 2,CreateAt = DateTime.Now,IsDelete = false};
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent:false, rememberBrowser:false);
                    
                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return RedirectToAction("Index", "Home");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }*/

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            //remove shopid in session
            this.DeleteShopId();
            return RedirectToAction("Login", "Account");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        //add list error to ModelState
        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }
        #endregion
    }
}