$(function() {
    get_list_students();
    $("form").on('submit', function(event) {
        event.preventDefault();
    });
    select_class();
    $('.tabs').tabs();
    $('#add_student_form').on('submit', function() {
        submit_add_student($('#add_student_form').serializeArray());
        $('#add_student_form')[0].reset();
    });
    $('#add_via_file').on('submit', function() {
        $('#preload').removeClass('hidden');
        submit_add_student_via_file();
        $('#add_via_file')[0].reset();
        $('#preload').addClass('hidden');
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
        select_class();
        var elem = document.querySelector(this.id);
        var instance = M.Modal.init(elem);
        var instance = M.Modal.getInstance(elem);
        instance.open();
    });
    $("form").on('submit', function(event) {
        event.preventDefault();
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
    var url = "index.php?action=delete_check_students";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        $('#table_students').DataTable().ajax.reload();
        $('#select_all').prop('checked', false);
        $('#select_action').addClass('hidden');
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);

}

function get_list_students() {
    $('#table_students').DataTable( {
        "sPaginationType" : "full_numbers",
        "processing": true,
        "serverSide": true,
        "ajax": {
            url :"index.php?action=list_students",
            type: "post",
            error: function(res){
                console.log("Error");
            }
        },
        "columns": [
        {
            "data": "idthisinh",
            "title": '<p><label><input type="checkbox" id="select_all" /><span></span></label></p>'
        },
        {
            "data": "idthisinh",
            "title": "ID"
        }, 
        {
            "data": "hoten",
            "title": "T??n th?? sinh"
        },
        {
            "data": "tentaikhoan",
            "title": "T??n t??i kho???n"
        },
        {
            "data": "tenkythi",
            "title": "K??? thi"
        },
        {
            "data": "email",
            "title": "Email"
        },
        {
            "data": "sodienthoai",
            "title": "S??T"
        },
        {
            "data": "ngaysinh",
            "title": "Ng??y Sinh"
        }
        ],
        "columnDefs":[
        {
            "targets":0,
            "render": function(data) 
            {
                return '<p><label><input type="checkbox" name="checkbox_students" class="checkbox" onchange="check_box();" value="' + data + '" /><span></span></label></p>'
            }
        }, 
        {
            "bSortable": false,
            "aTargets": [0, 2]
        },
        ],
        'aaSorting': [
        [1, 'asc']
        ],
        "language": {
            "lengthMenu": "Hi???n th??? _MENU_",
            "zeroRecords": "Kh??ng t??m th???y",
            "info": "Hi???n th??? trang _PAGE_/_PAGES_",
            "infoEmpty": "Kh??ng c?? d??? li???u",
            "emptyTable": "Kh??ng c?? d??? li???u",
            "infoFiltered": "(t??m ki???m trong t???t c??? _MAX_ m???c)",
            "sSearch": "T??m ki???m",
            "processing": "??ang t???i!",
            "paginate": {
                "first": "?????u",
                "last": "Cu???i",
                "next": "Sau",
                "previous": "Tr?????c"
            },
        }
    } );
    $('.modal').modal();
    $('select').select();
    $('body').attr('style', 'overflow: auto;');
    $("form").on('submit', function(event) {
        event.preventDefault();
    });
}

function student_edit_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" style="margin-bottom: 7px;" href="#edit-' + data.student_id + '" id="#edit-' + data.student_id + '">S???a</a>' +
    '<div id="edit-' + data.student_id + '" class="modal modal-edit">' +
    '<div class="row col l12">' +
    '<form action="" method="POST" role="form" id="form-edit-student-' + data.student_id + '">' +
    '<div class="modal-content"><h5>S???a: ' + data.name + '</h5>' +
    '<div class="modal-body">' +
    '<div class="col l6 s12">' +
    '<div class="input-field">' +
    '<input type="hidden" value="' + data.student_id + '" name="student_id">' +
    '<input type="hidden" value="' + data.username + '" name="username">' +
    '<input type="text" value="' + data.name + '" name="name" required>' +
    '<label for="name" class="active">T??n</label>' +
    '</div>' +
    '<div class="input-field">' +
    '<input type="password" name="password" required>' +
    '<label for="password">M???t Kh???u</label>' +
    '</div>' +
    '</div>' +
    '<div class="col l6 s12">' +
    '<div class="input-field">' +
    '<select name="gender_id">' +
    '<option value="1" selected>Kh??ng X??c ?????nh</option>' +
    '<option value="2">Nam</option>' +
    '<option value="3">N???</option>' +
    '</select>' +
    '<label>Gi???i T??nh</label>' +
    '</div>' +
    '<div class="input-field">' +
    '<select name="class_id" onchange="test(this.value)">' +
    '</select>' +
    '<label>K??? thi</label>' +
    '</div>' +
    '<div class="input-field">' +
    '<input type="date" value="' + data.birthday + '" name="birthday" required>' +
    '<label for="birthday" class="active">Ng??y Sinh</label>' +
    '</div>' +
    '</div>' +
    '</div></div>' +
    '</div><div class="col l12 s12">' +
    '<div class="modal-footer">' +
    '<a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Tr??? L???i</a>' +
    '<button type="submit" class="waves-effect waves-green btn-flat modal-action modal-close" onclick="submit_edit_student(' + data.student_id + ')">?????ng ??</button>' +
    '</div></div></form></div></div>';
}

function student_del_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" href="#del-' + data.student_id + '" id="#del-' + data.student_id + '">X??a</a>' +
    '<div id="del-' + data.student_id + '" class="modal"><div class="modal-content">' +
    '<h5>C???nh B??o</h5><p>X??c nh???n x??a t??i kho???n ' + data.username + '</p></div>' +
    '<form action="" method="POST" role="form" onsubmit="submit_del_student(this.id)" id="form-del-student-' + data.student_id + '">' +
    '<div class="modal-footer"><a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Tr??? L???i</a>' +
    '<input type="hidden" value="' + data.student_id + '" name="student_id">' +
    '<button type="submit" class="waves-effect waves-green btn-flat modal-action modal-close">?????ng ??</button></div></form></div>';
}

function submit_add_student(data) {
    $('#preload').removeClass('hidden');
    var url = "index.php?action=check_add_student";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#table_students').DataTable().ajax.reload();
            $('.modal').modal();
            $('select').select();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_add_student_via_file() {
    $('#preload').removeClass('hidden');
    $('#error').text('');
    var file_data = $('#file_data').prop('files')[0];
    var class_id = $('#_student_add_class_id').val();
    var type = file_data.type;
    var size = file_data.size;
    var match = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (type == match[0] || type == match[1]) {
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('class_id', class_id);
        $.ajax({
            url: 'index.php?action=check_add_student_via_file',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(result) {
                var json_data = $.parseJSON(result);
                show_status(json_data);
                $('#table_students').DataTable().ajax.reload();
                $('.modal').modal();
                $('select').select();
            }
        });
    } else {
        $('#error').text('Sai ?????nh d???ng m???u, y??u c???u file excel ??u??i .xlsx theo m???u. N???u file l???i vui l??ng t???i l???i m???u v?? ??i???n l???i.');
    }
    $('#preload').addClass('hidden');
}

function submit_del_student(data) {
    $('#preload').removeClass('hidden');
    data = $('#' + data).serializeArray();
    var url = "index.php?action=check_del_student";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#table_students').DataTable().ajax.reload();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_edit_student(data) {
    $('#preload').removeClass('hidden');
    form = $('#form-edit-student-' + data);
    data = $('#form-edit-student-' + data).serializeArray();
    var url = "index.php?action=check_edit_student";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#table_students').DataTable().ajax.reload();
            form[0].reset();
            $('.modal').modal();
            $('select').select();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}