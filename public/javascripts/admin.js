$(document).ready(function(){
    $('#login').click(function(){
        var ipts = $(this).parents('.form-horizontal.install-form')[0],
        formData = {};

        for(var i = 0; i < ipts.length; i++){
            formData[ipts[i].name] = ipts[i].value
        }
        
        $.ajax({
            url: '../api/login',
            type: 'POST',
            data: formData,
            success: (data) => {
                console.log(data)
            },
            error: (err, msg) => {
                console.log(msg)
            }
        });
    });

    $('#addRole').click(function(){
        var ipts = $('.role').parent();

        var roles = []
        for(var i = 0; i < ipts.length; i++){
            roles.push({
                "roleName": $(ipts[i]).find('.role').data('role'),
                "group":  $(ipts[i]).find('input[type="radio"]:checked').val()
            })
        }

        // console.log(roles)
        var formData = {
            name: $('input[name="rolename"]').val(),
            remark: $('input[name="remark"]').val(),
            roles: roles
        }

        $.ajax({
            url: '../api/addRole',
            type: 'POST',
            data: formData,
            success: function(){
                alert('添加成功')
            }
        });
    });

    $('#addUser').click(function(){
        var formData = {
            email: $('input[name="email"]').val(),
            pwd: $('input[name="pwd"]').val(),
            remark: $('input[name="remark"]').val(),
            roles: {
                _id: $("#role  option:selected").val(),
                _text: $("#role  option:selected").text(),
            }
        }

        // console.log(formData)
        $.ajax({
            url: '../api/addUser',
            type: 'POST',
            data: formData,
            success: function(){
                alert('添加成功')
            }
        })
    });
});