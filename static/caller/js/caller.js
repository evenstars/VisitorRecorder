'use strict';

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

var hideBox = function(el) {
    el = $(el);

    el.addClass('opacity').off('transitionend').one('transitionend', function() {
        el.hide();
        el.removeClass('opacity');
    });
};

var showBox = function(el, callback) {
    el = $(el);

    el.addClass('opacity');
    el.show();
    setTimeout(function() {
        el.removeClass('opacity').off('transitionend').one('transitionend', function() {
            callback && callback();
        });
    });
};

var resetCamera = function() {
    $('.g_camera .loading').hide();
    $('.g_camera .training').hide();
};


$('.training').hide();
$('.g_camera .loading').hide();
$('.g_camera .finding').hide();
// 拍照按钮
var token = 0;
var buttonTimesTrain = 0;
var times = 0;


// var buttonTimesRecognize = 0;
// // 识别
// var container = new Vue({
//     el : '#container',
//     data : {
//         img1: '',
//         img2: '',
//         img3: '',
//         img4: '',
//         img: './images/xxx.jpg',
//         recognizeimg : './images/xxx.jpg',
//         timer2: null,
//         recognizepic1: './images/xxx.jpg',
//         recognizepic2: './images/p2.png',
//         recognizename: '',
//         recognizeaddress: '',
//         persons : [],
//         options: option,
//         visitimg: './images/xxx.jpg',
//         visitname: '',
//         visitaddress: '',
//         visitrecords: [],
//         id: -1,
//         timer1: null,
//         timer2: null,
//         visitTimes: 0,
//         selected: '',
//         evervisitTimes: "欢迎您第 1 次访问",
//         warning: '',
//         name: '',
//         address: ''
//     },
//     created: function() {
//          var self = this;
//         setInterval(function() {
//             self.askIfTraining();
//         }, 1000);
//     },
//     methods : {
//         askIfTraining: function() {
//             var self = this;

//             getJSON('/face_recognition/is_tarining', function(result) {
//                 if ( !result && !result.successful ) {
//                     return;
//                 }

//                 if ( result.data.isTraining) {
//                     console.log(result.data.isTraining);
//                     token = result.data.token;
//                     self.img1 = '/training/'+result.data.path[0];
//                     self.img2 = '/training/'+result.data.path[1];
//                     self.img3 = '/training/'+result.data.path[2];
//                     self.img4 = '/training/'+result.data.path[3];
//                     $('.training').show();
//                     $('.g_camera .finding').hide();
//                     $('.app').attr('disabled', false);
//                     $('.g_camera .training .submit').attr('disabled', false);
//                 }
//             });
//         },
//         send: function() {
//             var self = this;
//             console.log('snap');
//             self.name = '';
//             self.address = '';
//             if($('.app').attr('disabled') != 'disabled'){
//                 $('.training').hide();
//                 $('.g_camera .loading').hide();
//                 $('.g_camera .finding').hide();

//                 $('.app').attr('disabled', true);
//                 postJSON('/face_recognition/call_snap', {}, function(result) {
//                     if ( result && result.successful ) {
//                         self.warning = "发送拍摄指令成功";
//                         $('.w_alert').show();
//                     return;
//                     }
//                 });

//                 return false;
//             }
//         },
//         showSignature: function(){
//             var self = this;
//             console.log('training');
//             if(self.address == ""){
//                 self.warning = "请输入单位";
//                 $('.w_alert').show();
        
//                 return;
//             }
//             $('.canvas').show();
//             canvasShow();
//             $('.training').hide();
//             $('.g_camera .loading').hide();
//             $('.g_camera .finding').hide();

//         },
//         training : function() {
//             var self = this;
//             if($('.canvas .submit').attr('disabled') != 'disabled'){
//                 // console.log('training');
//                 // if(self.address == ""){
//                 //     self.warning = "请输入单位";
//                 //     $('.w_alert').show();
            
//                 //     return;
//                 // }
//                 $('.canvas').hide();
//                 $('.training').hide();
//                 $('.g_camera .loading').show();
//                 $('.g_camera .loading .l').show();

//                 $('.g_camera .loading .tips_error').hide();
//                 $('.g_camera .loading .tips_success').hide();
//                 $('.g_camera .loading .tips_w').hide();

//                 $('.canvas .training .submit').attr('disabled', true);

//                 var signature = document.getElementById('myCanvas').toDataURL().substring(22);
//                 console.log('signature', signature);
//                 var request = new Request('/face_recognition/training');
//                 var postData = {
//                     name: "",
//                     address: self.address.replace(/\s+/g,''),
//                     token: token,
//                     signature: signature
//                 };
//                 console.log(postData);
//                 self.options.forEach( option => {
//                     if(option.value == self.selected){
//                         console.log(fromJSON(toJSON(option)));
//                         if (option.type == 'default') {
//                             self.warning = '请选择城市';
//                             $('.w_alert').show();
//                             return;
//                         }
//                         else {
//                             if(option.type == 'city'){
//                                  postData.city = option.description;
//                             }
//                             else{
//                                 postData.continent = option.description;
//                             }
//                         }
//                         request.postJSON(postData, function(result) {
//                             $('.app').attr('disabled', false);
//                             $('.g_camera .loading').show();
//                             $('.g_camera .loading .l').hide();
//                             if(!result.successful){
//                                 console.log("trianing failed");
//                                 $('.g_camera .loading .tips_error').show();
//                                 $('.g_camera .loading .tips_w').show().html('信息录入失败，请重新录入！');
//                                 setTimeout(function() {
//                                     $('.g_camera .loading').hide();

//                                 }, 4000);

//                                 return;
//                             }

//                             // 刷新地图
//                             /*worldMap.init();
//                             chinaMap.init();*/
//                             postJSON('/face_recognition/call_initmap', {}, function(result) {
//                                 if (!result.successful) {
//                                     console.log('init false');

//                                     return;
//                                 }
//                             });
//                             $('.g_camera .loading .tips_success').show();
//                             $('.g_camera .loading .tips_w').show().html('信息录入成功！');
//                             setTimeout(function() {
//                                 $('.g_camera .loading').hide(); 
//                             }, 4000);
//                         });
//                     }
//                 });
//             }
//         }/*,
//         findVisitrecord : function(recordIndex){
//             console.log(recordIndex);
//             var self = this;
//             console.log(fromJSON(toJSON(self.persons[recordIndex])));
//             self.id = self.persons[recordIndex].Id;
//             self.visitname = self.persons[recordIndex].name;
//             self.visitaddress = self.persons[recordIndex].address;
//             self.visitimg = self.persons[recordIndex].imagePath;
            
//             showBox('.g_search_tl');
//             self.persons[recordIndex].visitRecords.forEach(function(visitRecord) {
//                 visitRecord.Time = formatDateTime(new Date(visitRecord.Time));
//             });
//             self.visitrecords = self.persons[recordIndex].visitRecords;
//             visitTimes = self.visitrecords.length;

//             self.evervisitTimes = "欢迎您第 " + visitTimes + " 次访问";

//             console.log(fromJSON(toJSON(self.visitrecords[0])));
//         },
//         scaleVisitRecord: function(recordIndex) {
//             var visitRecord = this.visitrecords[recordIndex];
//             $('.image-area img').attr('src', visitRecord.imagePath);
//             $('.image-area').show();
//         }*/
//     }
// });

// TODO 点击外部关闭窗口并且按钮解除diabled
$('.w_alert .btn').click(function(e) {
    $('.w_alert').hide();
});
$('.w_alert').click(function(e) {
    return false;
})
$('body').click(function(e) {
    console.log('click container');
    $('.training').hide();
    $('.loading').hide();
    $('.canvas').hide();
});
$('.training').click(function(e){
    return false;
});
$('.canvas').click(function(e){
    return false;
});

