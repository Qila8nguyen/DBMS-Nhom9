$(function() {
    $('#table_admins').DataTable().destroy();
    get_list_admins();
    $('.tabs').tabs();
    $('#add_admin_form').on('submit', function() {
        submit_add_admin($('#add_admin_form').serialize());
        $('#add_admin_form')[0].reset();
    });
    $('#add_via_file').on('submit', function() {
        $('#preload').removeClass('hidden');
        submit_add_admin_via_file();
        $('#add_via_file')[0].reset();
        $('#preload').addClass('hidden');
    });
    $('#select_all').on('change', function() {
        if(this.checked){
            $('.checkbox').each(function(){
                this.checked = true;
            });
            $('#select_action').removeClass('hidden');
        }else{
            $('.checkbox').each(function(){
                this.checked = false;
            });
            $('#select_action').addClass('hidden');
        }
    });
    $('table').on('click', 'a.modal-trigger', function(){
        $('select').select();
        var elem = document.querySelector(this.id);
        var instance = M.Modal.init(elem);
        var instance = M.Modal.getInstance(elem);
        instance.open();
    });
});

function check_box() {
    $('#select_action').removeClass('hidden');
    if($('.checkbox:checked').length == $('.checkbox').length){
        $('#select_all').prop('checked',true);
    }else{
        $('#select_all').prop('checked',false);
    }
    if($('.checkbox:checked').length == 0) {
        $('#select_action').addClass('hidden');
    }
}

function delete_check() {
    var _list_check = '';
    $('.checkbox:checked').each(function(){
        _list_check += this.value + ','
    });
    data = {
        list_check : _list_check
    }
    $('#preload').removeClass('hidden');
    var url = "index.php?action=delete_check_admins";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        $('#table_admins').DataTable().destroy();
        get_list_admins();
        $('#select_all').prop('checked',false);
        $('#select_action').addClass('hidden');
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
    
}

function get_list_admins() {
    $('#preload').removeClass('hidden');
    var url = "index.php?action=get_list_admins";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_list_admins(json_data);
        $('.modal').modal();
        $('select').select();
        $('#preload').addClass('hidden');
    };
    $.get(url, success);
}

function show_list_admins(data) {
    var list = $('#list_admins');
    list.empty();
    for (var i = 0; i < data.length; i++) {
        var tr = $('<tr class="fadeIn" id="admin-' + data[i].idnhomcauhoi + '"></tr>');
        tr.append('<td class=""><p><label><input type="checkbox" name="checkbox_students" class="checkbox" onchange="check_box();" value="' + data[i].idnhomcauhoi + '" /><span></span></label></p></td>');
        tr.append('<td class="">' + data[i].vanbanbotro + '</td>');
        tr.append('<td class="">' + data[i].loai + '</td>');
        tr.append('<td class="">' + data[i].diemtoidanhomcauhoi + '</td>');
 
        list.append(tr);
    }
    $('#table_admins').DataTable( {
        "language": {
            "lengthMenu": "Hiển thị _MENU_",
            "zeroRecords": "Không tìm thấy",
            "info": "Hiển thị trang _PAGE_/_PAGES_",
            "infoEmpty": "Không có dữ liệu",
            "emptyTable": "Không có dữ liệu",
            "infoFiltered": "(tìm kiếm trong tất cả _MAX_ mục)",
            "sSearch": "Tìm kiếm",
            "paginate": {
                "first":      "Đầu",
                "last":       "Cuối",
                "next":       "Sau",
                "previous":   "Trước"
            },
        },
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 0, 2] }, //hide sort icon on header of column 0, 2, 9
        ],
        'aaSorting': [[1, 'asc']] // start to sort data in second column
    } );
    $("form").on('submit', function(event) {
        event.preventDefault();
    });
}  
function admin_del_button(data) {
    return btn = '<a class="waves-effect waves-light btn modal-trigger" href="#del-' + data.admin_id + '" id="#del-' + data.admin_id + '">Xóa</a>' +
    '<div id="del-' + data.admin_id + '" class="modal"><div class="modal-content">' +
    '<h5>Cảnh Báo</h5><p>Xác nhận xóa tài khoản ' + data.username + '</p></div>' +
    '<form action="" method="POST" role="form" onsubmit="submit_del_admin(this.id)" id="form-del-admin-' + data.admin_id + '">' +
    '<div class="modal-footer"><a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Trờ Lại</a>' +
    '<input type="hidden" value="' + data.admin_id + '" name="admin_id">' +
    '<button type="submit" class="waves-effect waves-green btn-flat modal-action modal-close">Đồng Ý</button></div></form></div>';
}

function submit_add_admin(data) {
    $('#preload').removeClass('hidden');
    var url = "index.php?action=check_add_admin";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            // admin_insert_data(json_data);
            $('#table_admins').DataTable().destroy();
            get_list_admins();
            $('.modal').modal();
            $('select').select();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_add_admin_via_file() {
    $('#preload').removeClass('hidden');
    $('#error').text('');
    var file_data = $('#file_data').prop('files')[0];
    var type = file_data.type;
    var size = file_data.size;
    var match = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (type == match[0] || type == match[1]) {
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: 'index.php?action=check_add_admin_via_file',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(result) {
                var json_data = $.parseJSON(result);
                show_status(json_data);
                $('#table_admins').DataTable().destroy();
                get_list_admins();
                $('.modal').modal();
                $('select').select();
            }
        });
    } else {
        $('#error').text('Sai định dạng mẫu, yêu cầu file excel đuôi .xlsx theo mẫu. Nếu file lỗi vui lòng tải lại mẫu và điền lại.');
    }
    $('#preload').addClass('hidden');
}

function submit_del_admin(data) {
    $('#preload').removeClass('hidden');
    data = $('#' + data).serializeArray();
    var url = "index.php?action=check_del_admin";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#table_admins').DataTable().destroy();
            get_list_admins();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_edit_admin(data) {
    $('#preload').removeClass('hidden');
    form = $('#form_edit_admin_' + data);
    data = $('#form_edit_admin_' + data).serializeArray();
    var url = "index.php?action=check_edit_admin";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            $('#table_admins').DataTable().destroy();
            get_list_admins();
            form[0].reset();
            $('.modal').modal();
            $('select').select();
        }
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}
