var show = function(el) {
    el = $(el);
    el.show();
    el.animate({
        opacity: 1
    });
};

var hide = function(el) {
    el = $(el);
    el.animate({
        opacity: 0
    }, {
        complete: function() {
            el.hide();
        }
    });
};

var countdown = function(num, callback) {

    $(".camera").hide();
    $(".tip").hide();
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

// $(".BACK").click(function () {
//     $(".camera").show();
//     $(".circle1").show();
//     $(".circle2").show();
//     $(".circle3").show();
//     $(".tip").show();
//     $(".large_img").hide();
//     $(".visit_time").hide();
//     $(".avatar").hide();
//     $(".back").hide();
//     $(".QR_code").hide();
//     $(".BACK").hide();
// });