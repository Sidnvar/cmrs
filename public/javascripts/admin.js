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
});