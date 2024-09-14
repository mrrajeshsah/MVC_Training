using System.Web.Mvc;

namespace MyMVCFirst.Areas.HMS
{
    public class HMSAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "HMS";
            }
        } 

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "HMS_default",
                "HMS/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}