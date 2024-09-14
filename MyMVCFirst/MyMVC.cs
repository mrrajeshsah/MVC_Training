using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace MyMVCFirst
{
    public static class MyMVC
    {

        internal static JsonResult Error(this HttpResponseBase r, string message = "Some thing goes wrong")
        {
            var resp = (new JavaScriptSerializer()).Serialize(new
            {
                error = true,
                message = message
            }); ;
            var json = new JsonResult() { Data = resp, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            return json;
        }
        internal static JsonResult Success(this HttpResponseBase r, string message = "Success", object data = null)
        {
            var dic = new Dictionary<string, object>();
            dic["error"] = false;
            dic["message"] = message;
            if (data != null)
            {
                if (data.GetType() == typeof(DataTable))
                {
                    dic["data"] = (data as DataTable).toJsonObject();
                }
                else if (data.GetType() == typeof(DataSet))
                {
                    var ds = data as DataSet;
                    var i = 0;
                    foreach (DataTable dt in ds.Tables)
                    {
                        if (i == 0)
                        {
                            dic["data"] = dt.toJsonObject();
                        }
                        else
                        {
                            dic["data_" + i] = dt.toJsonObject();
                        }
                        i++;
                    }
                }
                else
                {
                    dic["data"] = data;
                }
            }

            var resp = (new JavaScriptSerializer()).Serialize(dic);
            var json = new JsonResult() { Data = resp, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            return json;
        }

        public static List<Dictionary<string, object>> toJsonObject(this DataTable dt)
        {
            var row = new List<Dictionary<string, object>>();
            foreach (DataRow dr in dt.Rows)
            {
                var child = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    if (col.DataType == typeof(DateTime))
                    {
                        if (dr[col] == DBNull.Value)
                        {
                            child.Add(col.ColumnName, "");
                        }
                        else
                        {
                            var date = Convert.ToDateTime(dr[col]);
                            if (date.Hour == 0 && date.Minute == 0)
                            {
                                child.Add(col.ColumnName, date.ToString("dd-MMM-yyyy"));
                            }
                            else
                            {
                                child.Add(col.ColumnName, date.ToString("dd-MMM-yyyy hh:mm tt"));
                            }
                        }
                    }
                    else
                    {
                        child.Add(col.ColumnName, dr[col]);
                    }

                }
                row.Add(child);
            }
            return row;
        }

    }
}