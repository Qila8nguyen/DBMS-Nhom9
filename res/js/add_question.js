$(function() {
    $('.tabs').tabs();
    $('select').select();

    //select_subject();
    select_nhomcauhoi();
    $('#add_question_form').on('submit', function() {
        submit_add_question($('#add_question_form').serializeArray());
        $('#add_question_form')[0].reset();
        CKEDITOR.instances.question_detail.setData('', function() {
            this.updateElement();
        })
        CKEDITOR.instances.answer_a.setData('', function() {
            this.updateElement();
        })
        CKEDITOR.instances.answer_b.setData('', function() {
            this.updateElement();
        })
        CKEDITOR.instances.answer_c.setData('', function() {
            this.updateElement();
        })
        CKEDITOR.instances.answer_d.setData('', function() {
            this.updateElement();
        })
        CKEDITOR.instances.answer_f.setData('', function() {
            this.updateElement();
        })
    });
    $('#add_via_file').on('submit', function() {
        $('#preload').removeClass('hidden');
        submit_add_question_via_file();
        $('#add_via_file')[0].reset();
        $('#preload').removeClass('hidden');
    });
});

function upload_image() {
    $('#uploading').removeClass('hidden');
    var file_data = $('#file').prop('files')[0];
    var type = file_data.type;
    var size = file_data.size;
    var match = ["image/png", "image/jpg", "image/jpeg"];
    if ((type == match[0] && size < 2048000) || (type == match[1] && size < 2048000) || (type == match[2] && size < 2048000)) {
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: 'index.php?action=uploadImage',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(result) {
                var json_data = jQuery.parseJSON(result);
                if(json_data.stt) {
                    $('#div-url').removeClass('hidden');
                    $('.help').css('color', 'green').text("Th??nh c??ng");
                    $('#file').val('');
                    $('#url').val(json_data.url);
                    $('#uploading').addClass('hidden');
                } else {
                    $('#div-url').addClass('hidden');
                    $('.help').css('color', 'red').text("Th???t b???i");
                    $('#file').val('');
                    $('#url').val('');
                    $('#uploading').addClass('hidden');
                }
            }
        });
    } else {
        $('.help').css('color', 'red').text('Ch??? ???????c upload file JPG, PNG nh??? h??n 2mb');
        $('#file').val('');
        $('#uploading').addClass('hidden');
    }
}

function submit_add_question(data) {
    data[0]['value'] = CKEDITOR.instances.question_detail.getData();
    data[1]['value'] = CKEDITOR.instances.answer_a.getData();
    data[2]['value'] = CKEDITOR.instances.answer_b.getData();
    data[3]['value'] = CKEDITOR.instances.answer_c.getData();
    data[4]['value'] = CKEDITOR.instances.answer_d.getData();
    data[5]['value'] = CKEDITOR.instances.answer_f.getData();
    $('#preload').removeClass('hidden');
    var url = "index.php?action=check_add_question";
    var success = function(result) {
        console.log(result)
        var json_data = $.parseJSON(result);
        show_status(json_data);
      //  select_subject();
        select_nhomcauhoi();
        $('#preload').addClass('hidden');
    };
    $.post(url, data, success);
}

function submit_add_question_via_file() {
    $('#preload').removeClass('hidden');
    $('#error').text('');
    var file_data = $('#file_data').prop('files')[0];
    var subject = $('#_subject').val();
    var type = file_data.type;
    var size = file_data.size;
    var match = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/wps-office.xlsx"];
    if (type == match[0] || type == match[1] || type == match[2]) {
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('subject_id', subject);
        $.ajax({
            url: 'index.php?action=check_add_question_via_file',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(result) {
                var json_data = $.parseJSON(result);
                show_status(json_data);
                //select_subject();
                select_nhomcauhoi();
            }
        });
    } else {
        $('#error').text('Sai ?????nh d???ng m???u, y??u c???u file excel ??u??i .xlsx theo m???u. N???u file l???i vui l??ng t???i l???i m???u v?? ??i???n l???i.');
    }
    $('#preload').addClass('hidden');
}