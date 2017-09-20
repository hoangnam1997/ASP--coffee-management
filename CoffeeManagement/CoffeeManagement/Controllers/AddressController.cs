using CoffeeManagement.Controllers.Service.AddressManagement;
using CoffeeManagement.Helpers;
using CoffeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace CoffeeManagement.Controllers
{
    [CustomAuthorize("Admin")]
    public class AddressController : Controller
    {
        private ICityService _cityService;

        private IDistrictService _districtService;

        private IWardService _wardService;


        public AddressController(CityService city, DistrictService district, WardService ward)
        {
            _cityService = city;
            _wardService = ward;
            _districtService = district;
        }

        /// <summary>
        /// Show address information
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            try
            {
                //get infomation about ward, city, district
                var wardViewList = _wardService.GetListWardView(isDelete: false);
                List<dynamic> resultReturn = new List<dynamic>();
                foreach (var item in wardViewList)
                {
                    resultReturn.Add(new
                    {
                        data = item,
                        flag = 0
                    });
                }
                
                return View(resultReturn);
            }
            catch (Exception )
            {
                return View("Error");
            }
        }

        public ActionResult DeleteWard(int id)
        {
            try
            {
                //find item
                var item = _wardService.SelectById(id);
                if (item != null && item.IsDelete == false)
                {
                    item.IsDelete = true;
                    _wardService.Update(item);
                    return Content("Remove success");
                }
                else
                {
                    return new HttpStatusCodeResult(HttpStatusCode.Forbidden, "Dữ liệu cần xóa không tồn tại");
                }
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Server Error");
            }
        }

        /// <summary>
        /// return add or edit ward dialog
        /// </summary>
        /// <param name="ward"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult AddOrEditWard(WardViewModel ward)
        {
            try
            {
                var city = _cityService.GetAll(isDelete:false).ToList();
                ViewBag.Cities = city;
                List<District> district;
                //get district of current city
                if (ward.Id != 0)
                {
                    //For is edit action
                    district = _districtService.SelectByCityID(ward.CityId).ToList();
                    ViewBag.Districts = district;
                    return View(ward); //show view for edit action
                }
                else
                {
                    //For add action
                    district = _districtService.SelectByCityID(city[0].ID).ToList();
                    ViewBag.Districts = district;
                    return View();//Show view for add action
                }
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Server Error");
            }

        }

        /// <summary>
        /// list all district by cityId
        /// </summary>
        /// <param name="cityId"></param>
        /// <returns></returns>
        public ActionResult GetDistricts(int cityId)
        {
            try
            {
                //get all district
                var district = _districtService.SelectByCityID(cityId);
                var result = (from d in district
                              select new
                              {
                                  d.ID,
                                  d.Name
                              }).ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Server Error");
            }
        }

        /// <summary>
        /// Update ward
        /// </summary>
        /// <param name="ward"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateWard(WardViewModel ward)
        {
            //format data
            Ward data = new Ward()
            {
                ID = ward.Id,
                Name = ward.WardName,
                DistrictID = ward.DistrictId
            };
            //validate data
            if (_wardService.Validate(data) == false)
            {
                return Json(new { Status = "error", Data = "Địa chỉ không đúng" }, JsonRequestBehavior.AllowGet);
            }
            try
            {
                //check address name is exist
                if (_wardService.ContainWith(data))
                {
                    return Json(new { Status = "error", Data = "Địa chỉ đã tồn tại" }, JsonRequestBehavior.AllowGet);
                }
                //insert or update
                var w = _wardService.SelectById(ward.Id);
                if (w == null) //ward is not found
                {
                    //add new ward
                    _wardService.Insert(new Ward()
                    {
                        Name = ward.WardName,
                        DistrictID = ward.DistrictId,
                        IsDelete = false
                    });
                    //get id of new ward
                    var wardAfterInsert = _wardService.GetAll()
                        .SingleOrDefault(wa => wa.Name == ward.WardName && wa.DistrictID == ward.DistrictId);
                    ward.Id = wardAfterInsert?.ID ?? -1;
                }
                else
                {
                    //update ward
                    w.Name = ward.WardName;
                    w.DistrictID = ward.DistrictId;
                    _wardService.Update(w);
                }
                //format result return
                var resultResult = new
                {
                    data = ward,
                    flag = 0
                };
                return Json(new { Status = "success", Data = resultResult }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Status = "error", Data = "Server bị lỗi" });
            }
        }
    }

}