function mpc_ddl_on_load(elementId) {
    $(function () {
        var data = { type: 'field-bind' };
        data['field_name'] = elementId;
        data['pageId'] = $('#frm-page-Id').val();
        var formData = $('#main-form').serializeArray();
        $.map(formData, function (input) {
            data[input.name] = input.value;
        });
        gowithData('../../data/ddl', 'Post', JSON.stringify({ data: data }), function (data) {
            if (!data.error) {
                var ddl = $(`#${elementId}`);
                $(`#${elementId} option:not(:first)`).remove();
                $.each(data.data, function (i, item) {
                    ddl.append($('<option>').text(item.name).val(item.id));
                });
            }
        })
    });
}
function mpc_ddl_on_change(elementId1, elementId2) {
    $(`#${elementId1}`).on('change', function () {
        var data = { type: 'field-bind' };
        data['field_name'] = elementId2;
        data['pageId'] = $('#frm-page-Id').val();
        var formData = $('#main-form').serializeArray();
        $.map(formData, function (input) {
            data[input.name] = input.value;
        });

        gowithData('../../data/ddl', 'Post', JSON.stringify({ data: data }), function (data) {
            if (!data.error) {
                var ddl = $(`#${elementId2}`);
                $(`#${elementId2} option:not(:first)`).remove();
                $.each(data.data, function (i, item) {
                    ddl.append($('<option>').text(item.name).val(item.id));
                });
                var ss = $(`#${elementId1}`).attr("data-" + elementId2.toLowerCase()); 
                $(`#${elementId1}`).removeAttr("data-" + elementId2.toLowerCase());
                $(`#${elementId2}`).val(ss); 
            }
        })
    });
}