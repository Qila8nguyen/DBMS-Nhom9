$(document).ready(function() {
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('select').select();
    $('#trigger-sidebar').on('click', function() {
        $('#sidebar-left').toggleClass('sidebar-show');
        $('#menu-icon').toggleClass('rot');
        $('#logout').toggleClass('sidebar-show');
        $('#box-content').toggleClass('box-content-mini');
        // $('#footer').toggleClass('footer-mini');

        togle_sidebar();
    });
    $('#menu').on('click', function() {
        $('#menu-arrow-up').toggleClass('hide');
        $('#menu-arrow-down').toggleClass('hide');
    });
    $('#btn-logout').on('click', function() {
        logout();
    });
    $("form").on('submit', function(event) {
        event.preventDefault();
    });

});

function show_status(json_data) {
    if (json_data.status) {
        $('#status').addClass('success');
        $('#status').removeClass('failed');
    } else {
        $('#status').addClass('failed');
        $('#status').removeClass('success');
    }
    $('#status').html(json_data.status_value);
    $('#status').animate({
        'height': '65',
        'line-height': '65px',
        'opacity': '1'
    }, 500);
    $('#status').delay(1000).animate({
        'opacity': '0',
        'height': '0',
        'line-height': '0px'
    }, 500);
}

function logout() {
    var url = "index.php?action=logout";
    var data = {
        confirm: true
    };
    var success = function(result) {
        var json_data = $.parseJSON(result);
        show_status(json_data);
        if (json_data.status) {
            setTimeout(function() {
                window.location.replace("index.php");
            }, 1500);
        }
    };
    $.post(url, data, success);
}

function valid_username_or_email(value, elem) {
    var url = "index.php?action=valid_username_or_email";
    var data = {
        usr_or_email: value
    };
    var success = function(result) {
        var json_data = $.parseJSON(result);
        if (json_data.status) {
            $('#valid-' + elem + '-true').removeClass('hidden');
            $('#valid-' + elem + '-false').addClass('hidden');
        } else {
            $('#valid-' + elem + '-false').removeClass('hidden');
            $('#valid-' + elem + '-true').addClass('hidden');
        }
    };
    $.get(url, data, success);
}


function select_teacher() {
    var url = "index.php?action=get_list_teachers";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=teacher_id]');
        sl.empty();
        if (json_data.length != 0) {
            $('#teacher_error').addClass('hidden');
            $.each(json_data, function(key, value) {
                sl.append('<option value="' + value.teacher_id + '">' + value.name + '</option>');
            });
        } else {
            $('#teacher_error').removeClass('hidden');
        }
        $('select').select();
    };
    $.get(url, success);
}

function select_grade() {
    var url = "index.php?action=get_list_grades";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=grade_id]');
        sl.empty();
        $.each(json_data, function(key, value) {
            sl.append('<option value="' + value.idkythi + '">' + value.tenkythi+ ' ('+ value.mota +')</option>');
        });
        $('select').select();
    };
    $.get(url, success);
}

function select_subject() {
    var url = "index.php?action=get_list_subjects";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=subject_id]');
        sl.empty();
        if (json_data.length != 0) {
            $('#subject_error').addClass('hidden');
            $.each(json_data, function(key, value) {
                sl.append('<option value="' + value.loai + '">' + value.loai + '</option>');
            });
        } else {
            $('#class_error').removeClass('hidden');
        }
        $('select').select();
    };
    $.get(url, success);
}

 
function select_nhomcauhoi() {
    var url = "index.php?action=get_list_nhomcauhoi";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=subject_id]');
        sl.empty();
        if (json_data.length != 0) {
            $('#subject_error').addClass('hidden');
            $.each(json_data, function(key, value) {
                sl.append('<option value="' + value.idnhomcauhoi + '">(' +value.loai+") "+ value.vanbanbotro + '</option>');
            });
        } else {
            $('#class_error').removeClass('hidden');
        }
        $('select').select();
    };
    $.get(url, success);
}
function select_class() {
    var url = "index.php?action=get_list_classes";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=idkythi]');
        sl.empty();
        if (json_data.length != 0) {
            $('#class_error').addClass('hidden');
            $.each(json_data, function(key, value) {
                sl.append('<option value="' + value.idkythi + '">' + value.tenkythi + '</option>');
            });
        } else {
            $('#class_error').removeClass('hidden');
        }
        $('select').select();
    };
    $.get(url, success);
}

function select_status() {
    var url = "index.php?action=get_list_statuses";
    var success = function(result) {
        var json_data = $.parseJSON(result);
        var sl = $('select[name=status_id]');
        sl.empty();
        $.each(json_data, function(key, value) {
            sl.append('<option value="' + value.status_id + '">' + value.detail + '</option>');
        });
        $('select').select();
    };
    $.get(url, success);
}

function valid_class_name(value) {
    var url = "index.php?action=valid_class_name";
    var data = {
        class_name: value
    };
    var success = function(result) {
        var json_data = $.parseJSON(result);
        if (json_data.status) {
            $('#valid-class-true').removeClass('hidden');
            $('#valid-class-false').addClass('hidden');
        } else {
            $('#valid-class-false').removeClass('hidden');
            $('#valid-class-true').addClass('hidden');
        }
    };
    $.get(url, data, success);
}



function togle_sidebar() {
    var url = "index.php?action=toggle_sidebar";
    var success = function(result) {};
    $.get(url, success);
}