using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyMVCFirst.Areas.HMS.Controllers
{
   // [RouteArea("hms")]
    public class HomeController : Controller
    {
        // GET: HMS/Home
        public ActionResult Home()
        {
            ViewBag.Name = "Rajesh";
            return View();
        } 


        public ActionResult getData(String methodId,Dictionary<string,object> data)
        {
             if(methodId=="test")
            {
                if(data["mobile"].ToString().Length!=10)
                {
                    return Response.Error("Please Enter Valid Mobile No.");
                }
                var dt = new DataTable();
                System.Threading.Thread.Sleep(3000);
                //data save or retrive from database 
                return Response.Success("Data Saved Successfully", dt);
            }

            return Response.Error("Invalid Method");
        }
      //  [Route("about")]
        public ActionResult AboutUs()
        {
            return View();
        }
        public ActionResult ContactUs()
        {
            return View();
        }
    }
}