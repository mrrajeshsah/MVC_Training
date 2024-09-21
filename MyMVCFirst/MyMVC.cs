using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Script.Serialization;

namespace MyMVCFirst
{
    public static class MyMVC
    {
        public static string con = "Data Source=sg1-wsq2.my-hosting-panel.com;Integrated Security=False;User ID=integert_devvtest;Password=purn@1085";
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


        public static MvcHtmlString LabelEditor(
     this HtmlHelper htmlHelper, String name, String type = "text", String labletext = null, String value = "", bool isRequired = false, string ddl_comma_seperated = null, object[] ddl_selectList = null, string ddl_optionlabel = "Select", string divCssClass = "col-md-12", object labelHtmlAttributes = null, object editorHtmlAttributes = null, bool isReadonly = false, bool isNoLabel = false, int? flex = null, string area = "")
        {

            var ob = new Dictionary<string, object>();
            if (editorHtmlAttributes != null)
            {
                ob = editorHtmlAttributes.ToDictionary();
            }
            if (isReadonly)
            {
                ob["readonly"] = true;
            }
            var sup = isRequired ? "<span class='text-danger spn-require'>*</span>" : "";
            var label = htmlHelper.Label(name, labletext ??  displayText(name), new { @class = "form-label", @for = name }).ToString();
            var editor = "";
            if (!ob.ContainsKey("class"))
            {
                ob["class"] = "";
            }
            if (type == "ddl")
            {

                ob["class"] = $"form-select {ob["class"]} ";
                editor = htmlHelper.DropDownList(name, ddl_comma_seperated == null ? (ddl_selectList == null ? Enumerable.Empty<SelectListItem>() : new SelectList(ddl_selectList)) : new SelectList(ddl_comma_seperated.Split(',')), ddl_optionlabel, ob).ToString();
                if (value != "")
                    editor += "<script> $('#" + name + "').val('" + value + "')</script>";
            }
            else if (type == "CheckBox-List")
            {
                var chks = ddl_comma_seperated.Split(',');
                var chkList = "";
                foreach (var txt in chks)
                {
                    chkList += $"<label class = 'me-2'> <input value='{txt}'  class='me-1' name='{name}' id='{name}'   type='checkbox'>{txt}</label>  ";
                }
                // var hi = htmlHelper.Hidden(m.FieldName).ToString();
                editor = $"<div class='border rounded p-2'>{chkList}</div>";
            }
            else if (type == "RadioButtons")
            {
                var chks = ddl_comma_seperated.Split(',');
                var chkList = "";
                foreach (var txt in chks)
                {
                    chkList += $"<label class = 'checkbox-inline'> <input    class='m-0' name='{name}' id='{name}'  value='{txt}'   type='radio'>{txt}</label>  ";
                }

                editor = $"<div class='border rounded p-2' >{chkList}</div>";
            }
            else if (type == "multiline")
            {
                ob["class"] = $"form-control {ob["class"]}";
                editor = htmlHelper.TextArea(name, value, ob).ToString();
            }

            else if (type == "lbl")
            {
                ob["class"] = $"form-control {ob["class"]}";
                ob["id"] = name;
                ob["name"] = name;
                //style=\"height:38px;background: #f5f5f5a6;\"
                //editor = htmlHelper.Label(name, value, ob).ToString();
                editor = $"<label  style=\"height:38px;background: #f5f5f5a6;\" class=\"{ob["class"]}\"   id=\"{name}\" name=\"{name}\"  >{value}</label>";
            }
            else if (type == "lbl-sm")
            {
                ob["class"] = $"form-control {ob["class"]}";
                ob["id"] = name;
                ob["name"] = name;
                //style=\"height:38px;background: #f5f5f5a6;\"
                //editor = htmlHelper.Label(name, value, ob).ToString();
                editor = $"<label  style=\"background: #f5f5f5a6;\" class=\"{ob["class"]}\"   id=\"{name}\" name=\"{name}\"  >{value}</label>";
            }
            else if (type.Contains("file"))
            {
                var filter = "";
                if (type.Contains("image"))
                {
                    filter = "accept = 'image/*'";
                }
                else if (type.Contains("pdf"))
                {
                    filter = "accept = 'application/pdf'";
                }
                else if (type.Contains("doc"))
                {
                    filter = "accept = '.doc,.docx,.xls,.xlsx,application/pdf'";
                }
                else if (type.Contains("-"))
                {
                    filter = $"accept = '.{type.Split('-')[1]}'";
                }
                var hidden = htmlHelper.Hidden(name, value).ToString();

                bool preview = true;
                var display = "";
                if (value == "")
                {
                    display = "display:none;";
                }
                var file = $"<input type='file' id='file_{name}'  hd-field={name} {filter} onchange='fileupload(this,\"" + area + "\")' class='form-control mb-2' />";
                var img = preview ? $"<img src='{value}' class='img-thumbnail' onerror = 'getTypeImage(this)' style='{display} height:70px;' id = 'img_{name}' />" : "";
                editor = $@"{ hidden}
                        { file}
                        { img} ";
            }
            else if (type == "CheckBox")
            {
                ob["class"] = $"{ob["class"]}";
                ob["type"] = type;
                editor = htmlHelper.TextBox(name, value, ob).ToString();
            }
            else
            {
                ob["class"] = $"form-control {ob["class"]}";
                ob["type"] = type;
                editor = htmlHelper.TextBox(name, value, ob).ToString();
            }
            if (isNoLabel)
            {
                label = "";
                sup = "";
            }
            var cls = $"class='{divCssClass}'";
            if (divCssClass == "")
            {
                cls = "";
            }
            var styl = $"";
            if (flex != null)
            {
                styl = $"style='flex: {flex}'";
            }
            var edc = $@"<div {cls} {styl}>
                        {label} {sup}
                        { editor} 
                    </div>";
            return MvcHtmlString.Create(edc);
        }

        public static Dictionary<string, object> ToDictionary(this object values)
        {
            var dict = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

            if (values != null)
            {
                foreach (PropertyDescriptor propertyDescriptor in TypeDescriptor.GetProperties(values))
                {
                    object obj = propertyDescriptor.GetValue(values);
                    dict.Add(propertyDescriptor.Name, obj);
                }
            }

            return dict;
        }
        public static string displayText(string text)
        {
            var res = "";
            bool isPrevUpper = false;
            int upperCount = 0;
            foreach (char c in text)
            {
                if (c == '_')
                {
                    res = res.Trim() + " ";
                    isPrevUpper = false;
                }
                else if (Char.IsUpper(c) && !isPrevUpper)
                {
                    isPrevUpper = true;
                    upperCount = 1;
                    if (res.Trim() == "")
                        res = $"{c.ToString().ToUpper()}";
                    else
                        res = res.Trim() + " " + c;
                }
                else if (Char.IsUpper(c))
                {
                    upperCount++;
                    res = res.Trim() + c;
                }
                else
                {
                    if (upperCount > 1)
                    {
                        isPrevUpper = true;
                        upperCount = 1;
                        res = res.Trim() + " " + c.ToString().ToUpper();
                    }

                    else
                    {

                        if (res.Trim() == "")
                        {
                            isPrevUpper = true;
                            res = $"{c.ToString().ToUpper()}";
                        }
                        else
                        {
                            isPrevUpper = false;
                            res = res.Trim() + c;
                        }
                    }
                }

            }
            return res;
        }
        public static DataTable dataTable(string query, string conStr = null)
        {
            var ds = dataSet(query, conStr);
            return ds.Tables[0];
        }

        public static string data(string query, string conStr = null)
        {
            var dt = dataTable(query, conStr);
            if (dt.Rows.Count == 0)
            {
                return "";
            }
            return dt.Rows[0][0].ToString();
        }

        public static DataSet dataSet(string query, string conStr = null)
        {
            var ad = new SqlDataAdapter(query, conStr ?? con);
            var ds = new DataSet();
            ad.Fill(ds);
            return ds;
        }
        public static void execute(string query, string conStr = null)
        {
            var ad = new SqlDataAdapter(query, conStr ?? MyMVC.con);
            var ds = new DataSet();
            ad.Fill(ds);
        }

        public static void Insert(string tableName, object jsonData, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var js = new JavaScriptSerializer();
            var json = js.Serialize(jsonData);
            var table = js.Deserialize<Dictionary<string, object>>(json);
            Insert(tableName, table, conStr, sqlCon, ignoreColumn);
        }
        public static void InsertOrUpdate(string tableName, object jsonData, string[] compareColumns, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var js = new JavaScriptSerializer();
            var json = js.Serialize(jsonData);
            var table = js.Deserialize<Dictionary<string, object>>(json);
            InsertOrUpdate(tableName, table, compareColumns, conStr, sqlCon, ignoreColumn);
        }
        public static void InsertOrUpdate(string tableName, object jsonData, string compareColumns, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var js = new JavaScriptSerializer();
            var json = js.Serialize(jsonData);
            var table = js.Deserialize<Dictionary<string, object>>(json);
            InsertOrUpdate(tableName, table, compareColumns.Split(','), conStr, sqlCon, ignoreColumn);
        }
        internal static void InsertOrUpdate(string tableName, Dictionary<string, object> table, string[] compareColumns, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var cols = ignoreColumn.Split(',');
            foreach (var c in cols)
            {
                if (table.ContainsKey(c))
                {
                    table.Remove(c);
                }
                else if (table.ContainsKey(c.ToUpper()))
                {
                    table.Remove(c.ToUpper());
                }
                else if (table.ContainsKey(c.ToLower()))
                {
                    table.Remove(c.ToLower());
                }
            }
            var source = new List<string>();
            var updateqry = new List<string>();
            var cmd = new SqlCommand();
            foreach (var key in table.Keys)
            {
                source.Add($"@{key} AS {key}");
                updateqry.Add($"target.{key}=source.{key}");
                cmd.Parameters.AddWithValue($"@{key}", table[key] == null ? DBNull.Value : table[key]);
            }

            var on_condition = new List<string>();
            foreach (var key in compareColumns)
            {
                on_condition.Add($"target.{key}=source.{key}");
            }
            var qry = $@"MERGE INTO {tableName} AS target
USING (SELECT {string.Join(",", source)}) AS source
ON ({string.Join(" and ", on_condition)} )
WHEN MATCHED THEN
    UPDATE SET {string.Join(",", updateqry)}
WHEN NOT MATCHED THEN
    INSERT ({string.Join(",", table.Keys)}) VALUES (source.{string.Join(",source.", table.Keys)});";
            cmd.CommandText = qry;
            cmd.ExecuteCommand(CommandType.Text, conStr, sqlCon);
        }
        internal static void Insert(string tableName, Dictionary<string, object> table, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var cols = ignoreColumn.Split(',');
            foreach (var c in cols)
            {
                if (table.ContainsKey(c))
                {
                    table.Remove(c);
                }
                else if (table.ContainsKey(c.ToUpper()))
                {
                    table.Remove(c.ToUpper());
                }
                else if (table.ContainsKey(c.ToLower()))
                {
                    table.Remove(c.ToLower());
                }
            }
            var qry = $"insert into {tableName} ({string.Join(",", table.Keys)}) values (@{string.Join(",@", table.Keys)})";
            var cmd = new SqlCommand(qry);
            foreach (var key in table.Keys)
            {
                cmd.Parameters.AddWithValue($"@{key}", table[key] ?? DBNull.Value);
            }
            cmd.ExecuteCommand(CommandType.Text, conStr, sqlCon);
        }
        public static void Update(string tableName, object jsonData, string where = null, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var js = new JavaScriptSerializer();
            var json = js.Serialize(jsonData);
            var table = js.Deserialize<Dictionary<string, object>>(json);
            Update(tableName, table, where, conStr, sqlCon, ignoreColumn);
        }
        public static void Update(string tableName, Dictionary<string, object> data, string where = null, string conStr = null, SqlConnection sqlCon = null, string ignoreColumn = "Id")
        {
            var cols = ignoreColumn.Split(',');
            foreach (var c in cols)
            {
                if (data.ContainsKey(c))
                {
                    data.Remove(c);
                }
                else if (data.ContainsKey(c.ToUpper()))
                {
                    data.Remove(c.ToUpper());
                }
                else if (data.ContainsKey(c.ToLower()))
                {
                    data.Remove(c.ToLower());
                }
            }
            var condition = where == null ? "" : "where " + where;
            var cmd = new SqlCommand();
            var qryprm = new List<String>();
            foreach (var key in data.Keys)
            {
                qryprm.Add($"{key}=@{key}");
                cmd.Parameters.AddWithValue($"@{key}", data[key] ?? DBNull.Value);
            }
            cmd.CommandText = $"update {tableName} set {string.Join(",", qryprm)} {condition}";
            cmd.ExecuteCommand(CommandType.Text, conStr, sqlCon);
        }
        public static bool ExecuteCommand(this SqlCommand cmd, CommandType ctype = CommandType.Text, string conStr = null, SqlConnection sqlCon = null)
        {
            var result = false;
            var scon = sqlCon ?? new SqlConnection(conStr ?? MyMVC.con);
            var isConOpenHere = false;
            cmd.CommandType = ctype;
            try
            {
                if (scon.State != System.Data.ConnectionState.Open)
                {
                    cmd.Connection = scon;
                    scon.Open();
                    isConOpenHere = true;
                }
                cmd.ExecuteNonQuery();
                result = true;
            }
            finally
            {
                if (isConOpenHere)
                {
                    scon.Close();
                    scon.Dispose();
                }
            }
            return result;
        }

        public static void Delete(string tableName, string where = null, string conStr = null, SqlConnection sqlCon = null)
        {
            var condition = where == null ? "" : "where " + where;
            var cmd = new SqlCommand();
            cmd.CommandText = $"delete from {tableName} {condition}";
            cmd.ExecuteCommand(CommandType.Text, conStr, sqlCon);
        }

    }
}