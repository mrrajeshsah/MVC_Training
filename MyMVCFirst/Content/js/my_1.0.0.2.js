
$(function () {
    $('.select').select2();
})
function bind_ddl(ddl_id, table, value_column, id_column, where, selecteditem) {
    $.ajax({
        url: '/My/bind_ddl',
        method: 'GET',
        data: { table: table, id: id_column, value: value_column, where: where },
        success: function (data) {
            if (!data instanceof Object) {
                data = JSON.parse(data);
            }
            //  console.log(data);
            var ddl = $(ddl_id);
            $(ddl_id + " option:not(:first)").remove();
            $.each(data, function (i, item) {
                ddl.append($('<option></option>').val(item.id).html(item.value));

            });
            //console.log(selecteditem);
            ddl.val(selecteditem);
        },
        error: function (err) {
            console.error(err);
        }
    })
}
//function getData(url, result) {
//    $.ajax({
//        url: url,
//        method: 'GET',
//        success: function (data) {
//            data = JSON.parse(data);
//            result(data);
//        },
//        error: function (err) {
//            console.error(err);
//        }
//    });
//}
function isString(value) {
    return typeof value === 'string';
}
function getData(url, data, result, prog) {
    var p;
    if (prog) {
        p = showProg();
    }
    if (!isString(data)) {
        data = JSON.stringify({ data: data })
    }
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (!data instanceof Object) {
                data = JSON.parse(data);
            }
            result(data);
            if (prog) {
                p.close();
            }
        },
        error: function (err) {
            console.log(err);
            if (prog) {
                p.close();
            }
        }
    });
}

function getwithData(url, data, result) {
    $.ajax({
        url: url,
        method: 'GET',
        data: data,
        success: function (data) {
            if (!data instanceof Object) {
                data = JSON.parse(data);
            }
            result(data);
        },
        error: function (err) {
            console.error(err);
        }
    });
}
function generateRandomId() {
    const timestamp = new Date().getTime().toString(16);
    const randomPart = Math.random().toString(16).substr(2, 4); // Adjust the length as needed
    return timestamp + randomPart;
}
//function runDpi(area, apicode, result) {
//    var url = "../../../data/api";
//    if (area) {
//        url = "../../../"+area+"/data/api";
//    }
//    var data = JSON.stringify({ data: { code: apicode } });
//    gowithData(url, 'Post', data, function (resp) {
//        result(resp);
//    })
//}
//function runSQLapi(apicode,result) {

//    var data = JSON.stringify({ data: { code: apicode } });
//    gowithData('../../data/api', 'Post', data, function (resp) { 
//        result(resp);
//    })
//}
function runSQLapi(apicode, result, aditional_data, area) {
    var url = "../../../data/api";
    if (area) {
        url = "../../../" + area + "/data/api";
    }
    var data = { code: apicode };
    var mdata = Object.assign({}, data, aditional_data);
    gowithData(url, 'Post', JSON.stringify({ data: mdata }), function (resp) {
        result(resp);
    })
}
function getApiData(data, result, area, prog) {
    var url = "../../../data/api";
    if (area) {
        url = "../../../" + area + "/data/api";
    }
    gowithData(url, 'Post', JSON.stringify({ data: data }), function (resp) {
        result(resp);
    }, prog)
}
$.fn.ddlText = function () {
    var ddl_id = $(this).attr("id");
   return $(`#${ddl_id} option:selected`).text();
}
$.fn.bind_ddl_data = function (data, name, value, empty) {
    var ddl = $(this);
    var ddl_id = $(this).attr("id");
    if (empty) {
        ddl.empty();
    }
    else {
        $(`#${ddl_id} option:not(:first)`).remove();
    }
    if (!name) {
        $.each(data, function (i, item) {
            var keys = Object.keys(item);
            name = keys[0];
            if (keys.length > 1) {
                value = keys[1];
            }
            return false;
        });
    }
    if (!value) {
        value=name
    }
    $.each(data, function (i, item) {
        ddl.append($("<option>").text(item[name]).val(item[value]));
    });
    return ddl
}
function bind_ddl_option(ddl_id, data) {
    var ddl = $('#' + ddl_id);
    $('#' + ddl_id + ' option:not(:first)').remove();
    var k_id = "";
    var k_value = "";
    $.each(data, function (i, item) {
        var keys = Object.keys(item);
        k_value = keys[0];
        k_id = keys[1];
        return false;
    });
    $.each(data, function (i, item) {
        ddl.append($("<option>").text(item[k_value]).val(item[k_id]));
    });
    // var ss = ddl.attr("data-" + ddl_id.toLowerCase());
    // ddl.removeAttr("data-" + ddl_id.toLowerCase());
    //ddl.val(ss);

}


function gowithData(url, type, data, result, prog) {
    var p;
    if (prog) {
        p = showProg();
    }
    $.ajax({
        url: url,
        method: type,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) { 
            try {
                data = JSON.parse(data);
            }
            catch
            {

            }
            //if (! data instanceof Object) {
            //    data = JSON.parse(data);
            //} 
            result(data);
            if (prog) {
                p.close();
            }
        },
        error: function (err) {
            console.log(err);
            if (prog) {
                p.close();
            }
        }
    });
}


function gotoPaymentPage(key, amount, desc, name, email, mobile, address, success, error) {
    if (!email) {
        email = "noemail@purnanksoftware.com"
    }
    var options = {
        "key": key, // Enter the Key ID generated from the Dashboard
        "amount": amount + "00", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Online Consultancy", //your business name
        "description": desc,
        "image": "http://doctor.purnanksoftware.com/Mobile/assets/img/register-top-img.png",
        "handler": function (response) {
            success({ 'payment_id': response.razorpay_payment_id, 'order_id': response.razorpay_order_id, 'signature': response.razorpay_signature })
            //  alert(response.razorpay_payment_id);
            //alert(response.razorpay_order_id);
            //  alert(response.razorpay_signature)
        },
        "prefill": {
            "name": name, //your customer's name
            "email": email,
            "contact": mobile
        },
        "notes": {
            "address": address
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        error(response.error)
        //alert(response.error.code);
        //alert(response.error.description);
        //alert(response.error.source);
        //alert(response.error.step);
        //alert(response.error.reason);
        //alert(response.error.metadata.order_id);
        //alert(response.error.metadata.payment_id);
    });
    rzp1.open();

}


function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    console.log(hours);
    var period = time.substr(6, 2);
    console.log(period);
    if (period === "PM" && hours < 12) {
        hours += 12;
    }
    if (period === "AM" && hours === 12) {
        hours -= 12;
    }
    var minutes = parseInt(time.substr(3, 2));

    console.log(minutes);
    return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
}
function muticheck(name, values) {

    var vls = values.split(",");
    //$("input[name='" + name + "']").prop("checked", false);
    for (var i = 0; i < vls.length; i++) {
        $("input[name='" + name + "'][value='" + vls[i] + "']").prop("checked", true);
    }
}
function getwithData(url, data, result) {
    $.ajax({
        url: url,
        method: 'GET',
        data: data,
        success: function (data) {
            if (!data instanceof Object) {
                data = JSON.parse(data);
            }
            result(data);
        },
        error: function (err) {
            console.error(err);
        }
    });
}
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle
    while (currentIndex !== 0) {

        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



function submitdata(url, data, result) {
    console.log(data);
    Swal.fire(
        {
            title: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: data,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (data) {
                        if (!data instanceof Object) {
                            data = JSON.parse(data);
                        } 
                        if (data.error) {
                            Swal.fire(
                                'Error!!',
                                data.message,
                                'error'
                            )
                            result(data);
                        }
                        else {
                            if (data.message == "") {
                                result(data);
                            }
                            else {


                                Swal.fire(
                                    'Success!!',
                                    data.message,
                                    'success'
                                ).then((res) => {
                                    if (res.isConfirmed) {
                                        result(data);
                                    }
                                })
                            }

                        }


                    },
                    error: function (err) {
                        Swal.fire(
                            'Error!!',
                            'Unable to submit your data',
                            'error'
                        )
                        console.error(err);
                    }
                });
            },

        })


}
function submitApi(area, methodId, data, result) {
    submitdata(`../../../${area}/data/${methodId}`, JSON.stringify({ data: data }), function (resp) {
        result(resp);
    });
}
function showProg(message) {
    if (!message) {
        message = "Please Wait..."
    }
    return Swal.fire(
        {
            title: message,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },

        })


}
function refreshtable(tableId) {
    var table = $(tableId).DataTable({
        lengthChange: false,
        scrollX: true, scrollCollapse: true, pageLength: 20,
        columnDefs: [
            { orderable: false, targets: '.no-sort' } // Disable sorting on columns with class 'no-sort'
        ],
        buttons: [{
            extend: 'excel',
            exportOptions: {
                columns: ':visible:not(.no-export)' // Include only visible columns except those with class 'no-export'
            }
        }, {
            extend: 'pdf',
            exportOptions: {
                columns: ':visible:not(.no-export)' // Include only visible columns except those with class 'no-export'
            }
        }, {
            extend: 'print',
            exportOptions: {
                columns: ':visible:not(.no-export)' // Include only visible columns except those with class 'no-export'
            }
        }]
    });
    table.buttons().container().appendTo(`${tableId}_wrapper .col-md-6:eq(0)`);
}



function fileupload(element) {
    // console.log('Current element: ' + element.id);
    var file = element.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('filetype', $(element).attr("accept"));
    var ss = $(element).attr("hd-field");
    $('#img_' + ss).attr("src", "../Content/images/loading.gif");
    $('#img_' + ss).show();
    $.ajax({
        url: '/My/upload',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.success) {
                var ss = $(element).attr("hd-field");
                $('#' + ss).val(data.path);
                $('#img_' + ss).attr("src", data.path);
                $('#img_' + ss).show();
            }
            else {
                $('#img_' + ss).hide();
                Swal.fire(
                    'Error!!',
                    data.message,
                    'error'
                )
            }
        },
        error: function (err) {
            $('#img_' + ss).hide();
            Swal.fire(
                'Error!!',
                'Error uploading file',
                'error'
            )
        }
    });
}
function fileupload(element, area) {
    // console.log('Current element: ' + element.id);

    var url = '/My/upload';
    if (area) {
        url = `../../${area}/my/upload`;
    }
    var file = element.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('filetype', $(element).attr("accept"));
    var ss = $(element).attr("hd-field");
    $('#img_' + ss).attr("src", "../../../Content/images/loading.gif");
    $('#img_' + ss).show();
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.success) {
                var ss = $(element).attr("hd-field");
                $('#' + ss).val(data.path);
                $('#img_' + ss).attr("src", data.path);
                $('#img_' + ss).show();
            }
            else {
                $('#img_' + ss).hide();
                Swal.fire(
                    'Error!!',
                    data.message,
                    'error'
                )
            }
        },
        error: function (err) {
            $('#img_' + ss).hide();
            Swal.fire(
                'Error!!',
                'Error uploading file',
                'error'
            )
        }
    });
}
function autocomplete(id, url) {
    $(id).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                data: { term: request.term },
                success: function (data) {
                    response(data);
                }
            });
        },
        minLength: 2
    });
}
$.fn.suggest = function (url, minLength = 1) {
    this.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                data: { term: request.term },
                success: function (data) {
                    response(data);
                }
            });
        },
        minLength: minLength
    });
    return this; // Return the jQuery object to enable chaining
};
$.fn.updatemenu = function (id) {
    //console.log('../../../../getmenu/' + id);
    var menu = $(this);
    $.ajax({
        url: '../../../../getmenu/' + id,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (!data instanceof Object) {
                data = JSON.parse(data);
            }
            // console.log(data);
            var clrs = ["#F44336", "#5E35B1", "#198754", "#653208", "#ffc107", "#58151c", "#B71C1C", "#D81B60", "#3949AB", "#2E7D32", "#FF3D00", "#AFB42B", "#00695C", "#DD2C00", "#D500F9", "#DCE775", "#FF6D00", "#F50057", "#7B1FA2", "#00ACC1", "#7C4DFF", "#00E676", "#651FFF", "#FFFF00", "#673AB7", "#651FFF", "#5E35B1"];
            var clr = 0;
            $.each(data, function (i, item) {
                // menu.append($('<li></li>').html(item.Header).attr("class", "menu-label"));
                var li = $('<li></li>');
                var a = $('<a></a>').attr("href", "Javascript:");
                var icon = $('<i></i>').attr("class", "parent-icon " + item.Icon).attr("style", "color: " + clrs[clr]);
                var lbl = $('<div></div>').attr("class", "menu-title").html(item.Header);
                if (item.child) {
                    a.attr("class", "has-arrow");
                    var ul = $('<ul></ul>');
                    ul.addClass("mm-collapse")
                    var child = JSON.parse(item.child);
                    $.each(child, function (ci, citem) {
                        var cli = $('<li></li>');
                        var ca = $('<a></a>').attr("href", citem.url);
                        var cicon = $('<i></i>').attr("class", 'bx bx-right-arrow-alt');
                        if (citem.OpenInNewTab == 'Yes') {
                            ca.attr("target", '_blank');
                        }
                        ul.append(cli.append(ca.append(cicon).append(citem.Header)));
                    });
                    menu.append(li.append(a.append(icon).append(lbl)).append(ul));
                }
                else {

                    var a = $('<a></a>').attr("href", item.url);
                    if (item.OpenInNewTab == 'Yes') {
                        a.attr("target", '_blank');
                    }
                    menu.append(li.append(a.append(icon).append(lbl)));
                }
                clr++;

            });
            $('#menu').metisMenu('dispose');
            $('#menu').metisMenu();
        }
    });
};
function loadmenu(menu_id, url) {
    var menu = $(`#${menu_id}`);
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (!data instanceof Object) {
                data = JSON.parse(data);
            }
            //data = JSON.parse(data);
            var clrs = ["#F44336", "#5E35B1", "#198754", "#653208", "#ffc107", "#58151c", "#B71C1C", "#D81B60", "#3949AB", "#2E7D32", "#FF3D00", "#AFB42B", "#00695C", "#DD2C00", "#D500F9", "#DCE775", "#FF6D00", "#F50057", "#7B1FA2", "#00ACC1", "#7C4DFF", "#00E676", "#651FFF", "#FFFF00", "#673AB7", "#651FFF", "#5E35B1"];
            var clr = 0;
            $.each(data, function (i, item) {
                var li = $('<li></li>');
                var a = $('<a></a>').attr("href", "Javascript:");
                var icon = $('<i></i>').attr("class", "parent-icon " + item.Icon).attr("style", "color: " + clrs[clr]);
                var lbl = $('<div></div>').attr("class", "menu-title").html(item.Header);
                if (item.child) {
                    a.attr("class", "has-arrow");
                    var ul = $('<ul></ul>');
                    ul.addClass("mm-collapse")
                    var child = JSON.parse(item.child);
                    $.each(child, function (ci, citem) {
                        var cli = $('<li></li>');
                        var ca = $('<a></a>').attr("href", citem.url);
                        var cicon = $('<i></i>').attr("class", 'bx bx-right-arrow-alt');
                        if (citem.OpenInNewTab == 'Yes') {
                            ca.attr("target", '_blank');
                        }
                        ul.append(cli.append(ca.append(cicon).append(citem.Header)));
                    });
                    menu.append(li.append(a.append(icon).append(lbl)).append(ul));
                }
                else {

                    var a = $('<a></a>').attr("href", item.url);
                    if (item.OpenInNewTab == 'Yes') {
                        a.attr("target", '_blank');
                    }
                    menu.append(li.append(a.append(icon).append(lbl)));
                }
                clr++;

            });
            menu.metisMenu('dispose');
            menu.metisMenu();
        }
    });
};
function getTypeImage(imgs) {
    var path = $(imgs).prop('src');
    if (path) {
        var ext = path.split('.').pop().toLowerCase();
        var extns = ['pdf', 'doc', 'xls', 'ppt', 'txt']
        if (ext == 'docx') {
            ext == 'doc'
        }
        else if (ext == 'xlsx') {
            ext == 'xls'
        }
        if (extns.includes(ext)) {
            $(imgs).prop('src', '../../Content/Images/Icons/' + ext + '.png')
        }
        else {
            $(imgs).prop('src', '../../Content/Images/Icons/file.png')
        }
    }
}
$.fn.edit = function (url, calback) {
    this.on('click', '.edit-button', function () {
        var id = $(this).data('id');
        row = $(this).closest('tr');
        var pageId = $('#frm-page-Id').val();
        var data = { id: id, pageId: pageId };
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify({ data: data }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                if (!data instanceof Object) {
                    data = JSON.parse(data);
                }
                calback(data, row);
                //  console.log(data); 
            }
        });
    });
    return this; // Return the jQuery object to enable chaining
};

$.fn.delete = function (url, calback) {
    this.on('click', '.delete-button', function () {
        var id = $(this).data('id');
        row = $(this).closest('tr');
        var table = $('#mytable').DataTable();
        var rowIndex = table.row(row).index();
        var pageId = $('#frm-page-Id').val();
        var data = { id: id, pageId: pageId };
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    {
                        title: 'Deleteing Please wait...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading()
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: JSON.stringify({ data: data }),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                success: function (data) {
                                    //console.log(data);
                                    if (!data instanceof Object) {
                                        data = JSON.parse(data);
                                    }
                                    if (!data.error) {
                                        Swal.fire(
                                            'Success!!',
                                            'Data Deleted Successfully',
                                            'success'
                                        )
                                        table.row(rowIndex).remove().draw();
                                        row.remove();
                                    }
                                    else {
                                        Swal.fire(
                                            'Error!!',
                                            data.message,
                                            'error'
                                        )
                                    }
                                    calback(data);

                                }
                            });
                        },

                    })
            }
        })
    });
    return this; // Return the jQuery object to enable chaining
};

$.fn.upload = function () {
    this.change(function () {
        var fl = $(this);
        var file = $(this)[0].files[0];
        var formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: '/My/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                fl.attr("file-path", data.path)
                // alert(data.path);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Error uploading file');
            }
        });
    });
    return this; // Return the jQuery object to enable chaining
};

function bind_ddl(ddl_source, ddl_id, fiterId, area) {
    if (!area) {
        area=".."
    }
    var pageId = $('#frm-page-Id').val();
    var ddl_value = $('#' + ddl_source).val();
    var data = { fiterId: fiterId, pageId: pageId };
    var selectedOption = $('#' + ddl_source + ' option:selected');
    data[ddl_source] = selectedOption.text();
    data[ddl_source + "_Value"] = selectedOption.val();
    var data = { data: data }
    gowithData(`../../${area}/mpc/onchange`, 'POST', JSON.stringify(data), function (resp) {
        console.log(resp);
        var ddl = $('#' + ddl_id);
        $("#" + ddl_id + " option:not(:first)").remove();
        var dt = resp.data;
        $.each(dt, function (i, item) {
            ddl.append(item);
        });
    })
}

function alertError(message) {
    return Swal.fire(
        'Error!!',
        message,
        'error'
    )
}
function alertSuccess(message) {

    return Swal.fire(
        'Success!!',
        message,
        'success'
    )

}
function alertWarning(message) {

    return Swal.fire(
        'Warning!!',
        message,
        'warning'
    )

}

function alertMessage(message, type) {
    if (!type) {
        type = 'warning';
    }

    return Swal.fire(
        'Warning!!',
        message,
        type
    ) 
}

function alertConfirm(msg, onConfirm) {
    Swal.fire({
        title: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm()
        }
    })
}


function alertErrorNotification(message) {
    Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-x-circle', delay: 2000,
        msg: message
    });
}
function alertSuccesNotification(message) {
    Lobibox.notify('success', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle', delay: 2000,
        msg: message
    });
}
function alertWarningNotification(message) {
    Lobibox.notify('warning', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false, delay: 2000,
        position: 'top right',
        icon: 'bx bx-error',
        msg: message
    });
}