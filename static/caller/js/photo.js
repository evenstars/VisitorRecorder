$('.app-camera').click(function () {

	countdown(4, function() {
     	var request = new Request('/face_recognition/call_snap');
        request.postJSON({id:1}, function(result) {
            console.log(result, 'result callsnap');   
        	if (result.successful) {
        		$('.g_camera .loading').show();
                $('.g_camera .loading .tips_error').hide();
                $('.g_camera .loading .tips_success').hide();
                $('.g_camera .loading .tips_w').hide();

        		countdown(3, function () {
        			window.location.href = "/caller/index.html";
        		});
        	}
        });
	});
});


var countdown = function(num, callback) {

    $(".countdown").show().html(num);

    var interval = setInterval(function() {
        num--;

        if(num <= 0) {
            $(".countdown").hide();
            clearInterval(interval);
            callback();
        } else {
            $(".countdown").html(num);
        }
    }, 1000);
};