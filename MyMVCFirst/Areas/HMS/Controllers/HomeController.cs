using MyMVCFirst;
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
                MyMVC.Insert("Student_Details", data);

                return Response.Success("Data Saved Successfully", MyMVC.dataTable("select * from Student_Details"));
            } 
            if(methodId=="update")
            {
                MyMVC.Update("Student_Details", data,$"id='{data["Id"]}'");

                return Response.Success("Data Saved Successfully", MyMVC.dataTable("select * from Student_Details"));
            }
             if(methodId== "test2")
            { 
                return Response.Success("Data Saved Successfully", MyMVC.dataTable("select * from Student_Details"));
            }

            return Response.Error("Invalid Method");
        }
      //  [Route("about")]
        public ActionResult AboutUs()
        {
            return View();
        }
        public ActionResult FormUsingEditor()
        {
            return View();
        }
        public ActionResult ContactUs()
        {
            return View();
        }
    }
}