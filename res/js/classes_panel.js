$(function() {
    get_list_classes();
    select_teacher();
    select_grade();
    $('#add_class_form').on('submit', function() {
        submit_add_class($('#add_class_form').serializeArray());
        $('#add_class_form')[0].reset();
    });
    $('#select_all').on('change', function() {
        if (this.checked) {
            $('.checkbox').each(function() {
                this.checked = true;
            });
            $('#select_action').removeClass('hidden');
        } else {
            $('.checkbox').each(function() {
                this.checked = false;
            });
            $('#select_action').addClass('hidden');
        }
    });
    $('table').on('click', 'a.modal-trigger', function() {
        $('select').select();
        select_teacher();
        select_grade();
        var elem = document.querySelector(this.id);
        var instance = M.Modal.init(elem);
        var instance = M.Modal.getInstance(elem);
        instance.open();
    });
});

function check_box() {
    $('#select_action').removeClass('hidden');
    if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('#select_all').prop('checked', true);
    } else {
        $('#select_all').prop('checked', false);
    }
    if ($('.checkbox:checked').length == 0) {
        $('#select_action').addClass('hidden');
    }
}

function delete_check() {
    var _list_check = '';
    $('.checkbox:checked').each(function() {
        _list_check += this.value + ','
    });
    data = {
        list_check: _list_check
    }
    $('#preload').removeClass('hidden');
    var url = "index.php?action=delete_check_classes";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        $('#table_classes').DataTable().destroy();
        get_list_classes();
        $('#select_all').prop('checked', false);
        $('#select_action').addClass('hidden');
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);

}

function get_list_classes() {
    $('#preload').removeClass('hidden');
    var url = "index.php?action=get_list_classes";
    var success = function(result) {
      //  console.log(result)
        var json_data = $.parseJSON(result);
        show_list_classes(json_data);
        $('.modal').modal();
        $('select').select();
        $('#preload').addClass('hidden');
    };
    $.get(url, success);
}

function show_list_classes(data) {
    var list = $('#list_classes');
    list.empty();
    for (var i = 0; i < data.length; i++) {
        var tr = $('<tr class="fadeIn" id="class-' + data[i].class_id + '"></tr>');
        tr.append('<td class=""><p><label><input type="checkbox" name="checkbox_students" class="checkbox" onchange="check_box();" value="' + data[i].idkythi + '" /><span></span></label></p></td>');
        tr.append('<td class="">' + data[i].tenkythi + '</td>');
        tr.append('<td class="">' + data[i].mota + '</td>');
        tr.append('<td class="">' + data[i].matkhau + '</td>');
        tr.append('<td class="">' + data[i].idqtv + '</td>');
        //tr.append('<td class="">' + class_edit_button(data[i]) + '<br />' + class_del_button(data[i]) + '</td>');
        list.append(tr);
    }
    $('#table_classes').DataTable({
        "language": {
            "lengthMenu": "Hi???n th??? _MENU_",
            "zeroRecords": "Kh??ng t??m th???y",
            "info": "Hi???n th??? trang _PAGE_/_PAGES_",
            "infoEmpty": "Kh??ng c?? d??? li???u",
            "emptyTable": "Kh??ng c?? d??? li???u",
            "infoFiltered": "(t??m ki???m trong t???t c??? _MAX_ m???c)",
            "sSearch": "T??m ki???m",
            "paginate": {
                "first": "?????u",
                "last": "Cu???i",
                "next": "Sau",
                "previous": "Tr?????c"
            },
        },
        "aoColumnDefs": [{
                "bSortable": false,
                "aTargets": [0]
            }, //hide sort icon on header of column 0, 5
        ],
        'aaSorting': [
            [1, 'asc']
        ] // start to sort data in second column
    });
    $("form").on('submit', function(event) {
        event.preventDefault();
    });
}

function class_edit_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" style="margin-bottom: 7px;" href="#edit-' + data.class_id + '" id="#edit-' + data.class_id + '">S???a</a>' +
        '<div id="edit-' + data.class_id + '" class="modal modal-edit">' +
        '<div class="row col l12">' +
        '<form action="" method="POST" role="form" id="form-edit-class-' + data.class_id + '">' +
        '<div class="modal-content"><h5>S???a: ' + data.class_name + '</h5>' +
        '<div class="modal-body">' +
        '<div class="col l12 s12">' +
        '<div class="input-field">' +
        '<input type="hidden" value="' + data.class_id + '" name="class_id">' +
        '<input type="text" value="' + data.class_name + '" name="class_name" readonly>' +
        '<label for="name" class="active">T??n L???p</label>' +
        '</div>' +
        '<div class="input-field">' +
        '<select name="grade_id">' +
        '</select>' +
        '<label>Kh???i</label>' +
        '</div>' +
        '<div class="input-field">' +
        '<select name="teacher_id">' +
        '</select>' +
        '<label>G??ao Vi??n</label>' +
        '</div>' +
        '</div>' +
        '</div></div>' +
        '<div class="row col l12 s12 modal-footer">' +
        '<a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Tr??? L???i</a>' +
        '<button type="submit" class="waves-effect waves-green btn-flat" onclick="submit_edit_class(' + data.class_id + ')">?????ng ??</button>' +
        '</div></form></div></div>';
}

function class_del_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" href="#del-' + data.class_id + '" id="#del-' + data.class_id + '">X??a</a>' +
        '<div id="del-' + data.class_id + '" class="modal"><div class="modal-content">' +
        '<h5>C???nh B??o</h5><p>X??c nh???n x??a ' + data.class_name + '</p></div>' +
        '<form action="" method="POST" role="form" onsubmit="submit_del_class(this.id)" id="form-del-class-' + data.class_id + '">' +
        '<div class="modal-footer"><a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Tr??? L???i</a>' +
        '<input type="hidden" value="' + data.class_id + '" name="class_id">' +
        '<button type="submit" class="waves-effect waves-green btn-flat modal-action modal-close">?????ng ??</button></div></form></div>';
}

function submit_add_class(data) {
    $('#preload').removeClass('hidden');
    var url = "index.php?action=check_add_class";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            // class_insert_data(json_data);
            $('#table_classes').DataTable().destroy();
            get_list_classes();
            $('.modal').modal();
            $('select').select();
            select_teacher();
            select_grade();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_del_class(data) {
    $('#preload').removeClass('hidden');
    data = $('#' + data).serializeArray();
    var url = "index.php?action=check_del_class";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            // $('#class-' + json_data.class_id).hide('400', function() {
            //     this.remove();
            // });
            $('#table_classes').DataTable().destroy();
            get_list_classes();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_edit_class(data) {
    $('#preload').removeClass('hidden');
    form = $('#form-edit-class-' + data);
    data = $('#form-edit-class-' + data).serializeArray();
    var url = "index.php?action=check_edit_class";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#table_classes').DataTable().destroy();
            get_list_classes();
            form[0].reset();
            select_teacher();
            select_grade();
            $('.modal').modal();
            $('select').select();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}
