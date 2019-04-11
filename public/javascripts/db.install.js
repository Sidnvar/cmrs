$(document).ready(function(){
    // 创建数据库
        $('#link_db').click(function(){
            var ipts = $(this).parents('.form-horizontal.install-form')[0],
                formData = {};

            for(var i = 0; i < ipts.length; i++){
                formData[ipts[i].name] = ipts[i].value
            }
            
            $.ajax({
                url: '../api/install',
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

    // 创建用户
    $('#add_user').click(function(){
        var formData = {
            user_name: 'dys_map',
            pwd: '123456',
            web_name: '盗月社地图'
        }

        $.ajax({
            url: '../api/config',
            type: 'POST',
            data: formData,
            success: (data) => {
                console.log(data)
            },
            error: (err, msg) => {
                console.log(msg)
            }
        })
    });
});