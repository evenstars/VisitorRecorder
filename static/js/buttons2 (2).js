    window.onload = function() {
        var container = document.getElementById('container');
        container.oncontextmenu = function () {
            return false;
        };
    };

   // 按钮事件
    (function() {
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

        var showVideo = function() {
            $(".g_home > .showvideo").addClass('active');
            showBox('.g_video');
            document.getElementById('video').currentTime = 0;
            document.getElementById('video').play();
        };

        var hideVideo = function() {
            $(".g_home > .showvideo").removeClass('active');
            hideBox('.g_video');
            document.getElementById('video').pause();
        };

        var showSearch = function() {
            $(".g_home > .showsearch").addClass('active');

            $('.g_search .result .loading').show().removeClass('active');
            $('.g_search .result .list').hide();
            $('.g_search .result .tips').text('输入检索条件');
            showBox('.g_search');
        };

        var hideSearch = function() {
            $(".g_home > .showsearch").removeClass('active');

            hideBox('.g_search');

            if($('.g_search_tl').is(':visible')) {
                hideBox(".g_search_tl");
            }
        };

        var reportMessage = function(message) {
            $('.train-tip.error-tip').hide();
            $('.train-tip.success-tip').show();
            $('.train-tip.success-tip').text(message);
        }

        var reportError = function(error) {
            $('.train-tip.success-tip').hide();
            $('.train-tip.error-tip').show();
            $('.train-tip.error-tip').text(error);
        }

        var messageBox = function(title, message) {
            $('.shadow-area').show();
            $('.shadow-area .v1').text(title);
            $('.shadow-area .message').text(message);
        }

        // $('.shadow-area .error-box').click(function(e) {
        //     $('.shadow-area').hide();

        //     return false;
        // });

        $('.shadow-area').click(function(e) {
            $('.shadow-area').hide();

            return false;
        });

        // 返回首页
        $(".g_home .showhome").click(function() {
            var btn = $(this);

            resetCamera();
            hideVideo();
            hideSearch();

            if(btn.data('toggle') == 1) {
                hide('.g_area');

                show('.g_earth');
                show('.g_camera');
                
                btn.data('toggle', 0);
            } else {
                hide('.g_earth');
                hide('.g_camera');

                show('.g_area');
                
                btn.data('toggle', 1);
            }
        });
        // 展示视频
        $(".g_home .showvideo").click(function() {
            if($(this).hasClass('active')) {
                return false;
            }

            hideSearch();
            showVideo();
        });
        // 展示搜索
        $(".g_home .showsearch").click(function() {
            if($(this).hasClass('active')) {
                return false;
            }

            hideVideo();
            showSearch();
        });
        // 关闭搜索按钮
        $(".g_search .close").click(function() {
            hideSearch();
        });
        // 关闭视频
        $(".g_video .close").click(function() {
            hideVideo();

        });

        var timer3 = null;
        var photowall = new Vue({
            el: '#photowall',
            data: {
                file:[]
            },
            created: function(){
                var self = this;
                var photowallget = function(){
                    var request = new Request('/face_recognition/photowall');
                    request.getJSON( function(result) {
                        if( !result.successful){
                            console.log('err');
                            return;
                        }
                        self.file = result.data.files;
                        console.log('self',self.file);

                        setTimeout( // 照片流拖拽
                            function() {
                                $('.g_gallery .g2').kxbdMarquee({
                                    isEqual:false,       //所有滚动的元素长宽是否相等,true,false
                                    loop: 0,            //循环滚动次数，0时无限
                                    direction: "up",  //滚动方向，"left","right","up","down"
                                    scrollAmount: 1,     //步长
                                    scrollDelay: 40      //时长
                                });

                                var status = {
                                    start: false,
                                    x: 0,
                                    y: 0,
                                    pick: null,
                                    moveto: null,
                                    placeholder: null
                                };

                                var collectAllPosition = function() {
                                    var all = [];

                                    $('.g_gallery li').each(function(key, el) {
                                        el = $(el);

                                        var offset = el.offset();

                                        offset.width = el.outerWidth();
                                        offset.height = el.outerHeight();
                                        offset.el = el;

                                        all.push(offset);
                                    });

                                    return all;
                                };

                                var lastClickTime = 0;
                                var clickCount = 0;

                                function dispatchClickEvent(events) {
                                    if ( lastClickTime === 0 ) {
                                        lastClickTime = Date.now();

                                        setTimeout(function() {
                                            if ( clickCount > 1 ) { 
                                                events.onDoubleClick();
                                            }
                                            else {
                                                events.onClick();
                                            }

                                            lastClickTime = 0;
                                            clickCount = 0;
                                        }, 250);
                                    }

                                    clickCount ++;
                                }

                                var lastPicked = null;
                                $('.g_gallery').on('click', 'li', function(e) {
                                    var target = $(e.currentTarget);
                                    if(target.hasClass('scale')) {
                                        target.removeClass('scale');
                                        target.removeClass('horizental');
                                        target.removeClass('vertical');
                                        target.removeClass('draging');
                                        // playScroll();
                                        return;
                                    }
                                    $('.g_gallery .draging').removeClass('draging');
                                    $('.g_gallery .scale').removeClass('scale');
                                    $('.g_gallery .scale').removeClass('horizental');
                                    $('.g_gallery .scale').removeClass('vertical');
                                    // //pauseScroll();

                                    dispatchClickEvent({
                                        onDoubleClick: function() {
                                            lastPicked = target;
                                        },
                                        onClick: function() {
                                            if(!lastPicked) {
                                                var currentImage = target.find('img')[0];

                                                if ( currentImage.width > currentImage.height ) {
                                                    target.addClass('horizental');
                                                }
                                                else {
                                                    target.addClass('vertical');
                                                }

                                                target.addClass('scale');
                                                target.addClass('draging');
                                            } 
                                            else {
                                                var lastPickedImage = lastPicked.find('img');
                                                var currentImage = target.find('img');

                                                var lastPickedSrc = lastPickedImage.attr('src');
                                                var currentSrc = currentImage.attr('src');

                                                lastPickedImage.attr('src', currentSrc);
                                                currentImage.attr('src', lastPickedSrc);
                                            }
                                            
                                            lastPicked = null;
                                        }
                                    });

                                    return false;
                                });
                            },1500);
                    });

                };
                photowallget();
                //self.timer3 = setInterval(photowallget(),1000 * 60 * 3);
            }
        });
 
         // 拍照按钮
        var token = 0;
        var buttonTimesTrain = 0;
        var times = 0;
        

        var buttonTimesRecognize = 0;
        // 识别
        var container = new Vue({
            el : '#container',
            data : {
                img1: '',
                img2: '',
                img3: '',
                img4: '',
                img: './images/xxx.jpg',
                recognizeimg : './images/xxx.jpg',
                timer2: null,
                recognizepic1: './images/xxx.jpg',
                recognizepic2: './images/p2.png',
                recognizename: '',
                recognizeaddress: '',
                persons : [],
                options: option,
                visitimg: './images/xxx.jpg',
                visitname: '',
                visitaddress: '',
                visitrecords: [],
                id: -1,
                timer1: null,
                timer2: null,
                visitTimes: 0,
                selected: '',
                evervisitTimes: "欢迎您第 1 次访问",
                warning: '',
                name: '',
                address: ''
            },
            created: function() {
                var self = this;
                setInterval(function() {
                    self.askIfSnapping();
                }, 1000);
            },
            methods : {
                askIfSnapping: function() {
                    var self = this;

                    getJSON('/face_recognition/is_snap', function(result) {
                        if ( !result && !result.successful ) {
                            console.log(result);
                            return;
                        }

                        if ( result.data.isSnapping) {
                            console.log(result.data.isSnapping);
                            self.take();
                        }
                    });
                },
                training : function() {
                    var self = this;
                    if(self.name == "" || self.address == ""){
                        self.warning = "请输入姓名或单位";
                        $('.w_alert').show();
                
                        return;
                    }
                    $('.training').hide();
                    $('.g_camera .loading').show();
                    $('.g_camera .loading .l').show();

                    $('.g_camera .loading .tips_error').hide();
                    $('.g_camera .loading .tips_success').hide();
                    $('.g_camera .loading .tips_w').hide();

                    $('.g_camera .training .submit').attr('disabled', true);
                    var request = new Request('/face_recognition/training');
                    var postData = {
                        name: self.name.replace(/\s+/g,''),
                        address: self.address.replace(/\s+/g,''),
                        token: token
                    };
                    self.options.forEach( option => {
                        if(option.value == self.selected){
                            console.log(fromJSON(toJSON(option)));
                            if (option.type == 'default') {
                                self.warning = '请选择城市';
                                $('.w_alert').show();
                            }
                            else {
                                if(option.type == 'city'){
                                     postData.city = option.description;
                                }
                                else{
                                    postData.continent = option.description;
                                }
                            }
                            request.postJSON(postData, function(result) {
                                $('.g_camera .loading').show();
                                $('.g_camera .loading .l').hide();
                                if(!result.successful){
                                    console.log("trianing failed");
                                    $('.g_camera .loading .tips_error').show();
                                    $('.g_camera .loading .tips_w').show().html('信息录入失败，请重新录入！');
                                    setTimeout(function() {
                                        $('.g_camera .loading').hide();  
                                    }, 4000);

                                    return;
                                }

                                // 刷新地图
                                worldMap.init();
                                chinaMap.init();
                                $('.g_camera .loading .tips_success').show();
                                $('.g_camera .loading .tips_w').show().html('信息录入成功！');
                                setTimeout(function() {
                                    $('.g_camera .loading').hide();  
                                }, 4000);
                            });
                        }
                    });
                    
                },
                take: function() {
                    var self = this;

                    self.name = '';
                    self.address = '';

                    console.log($('.g_camera .take .btn').attr('disabled'));
                    if($('.g_camera .take .btn').attr('disabled') != 'disabled'){
                        $('.g_camera .training .submit').attr('disabled', false);
                        $('.g_camera .take .btn').attr('disabled', true);
                        console.log("stop");

                        $('.training').hide();
                        $('.g_camera .loading').hide();
                        hideVideo();
                        hideSearch();

                        self.timer1 = setInterval(function(){
                            var req = new Request('/face_recognition/realtime');
                            req.getJSON( function(result) {
                                if ( self.timer1 == null ) {
                                    return;
                                }
                                if(!result.successful) {
                                    console.log("err");
                                    return;
                                }
                                console.log('times',times ++);
                                self.img = 'http://192.168.62.101:8080/snapping/' + result.data.path[0];
                                console.log('self.img',self.img);
                            });
                        }, 1000);

                        // TODO倒计时，时间结束clearInterval，发送请求
                         var countdown = function(num, callback) {
                            $(".g_camera .countdown").show().html(num);

                            var interval = setInterval(function() {
                                num--;

                                if(num <= 0) {
                                    $(".g_camera .countdown").hide();
                                    clearInterval(interval);
                                    callback();
                                } else {
                                    $(".g_camera .countdown").html(num);
                                }
                            }, 1000);
                        };

                        countdown(4 /* 4秒等待 */, function() {
                            clearInterval(self.timer1);
                            $('.g_camera .finding').show();

                            var request = new Request('/face_recognition/snapping');
                            request.getJSON( function(result) {
                                if(!result.successful) {
                                    console.log("snap err");
                                    return;
                                }
                                token = result.data.token;
                                postData = {
                                    token: token
                                };

                                var request = new Request('/face_recognition/recognition');
                                request.postJSON(postData, function(recognizeResult) {
                                    $('.g_camera .finding').hide();
                                    $('.g_camera .take .btn').attr('disabled', false);
                                    // 识别返回结果后将圆圈的图片设为固定
                                    self.img =  './images/xxx.jpg';
                                    if( !recognizeResult.successful ){
                                        console.log("recognize err");
                                        var callreq = new Request('/face_recognition/call_training');
                                        var data = {
                                            token: token
                                        };
                                        callreq.postJSON(data, function(result) {
                                            if(!result.successful) {
                                                console.log('post err');
                                            }
                                        });
                                        self.img1 = '/training/'+result.data.path[0];
                                        self.img2 = '/training/'+result.data.path[1];
                                        self.img3 = '/training/'+result.data.path[2];
                                        self.img4 = '/training/'+result.data.path[3];
                                        // token = result.data.token;                    
                                        $('.training').show();        
                                        return;
                                    }
                                    // 识别成功显示时间轴
                                    self.persons = recognizeResult.data.detectedPersons;
                                    console.log('persons',fromJSON(toJSON(self.persons[0])));
                                    self.id = self.persons[0].Id;
                                    self.visitname = self.persons[0].name;
                                    self.visitaddress = self.persons[0].address;
                                    self.visitimg = self.persons[0].imagePath;

                                    showBox('.g_search_tl');
                                    self.persons[0].visitRecords.forEach(function(visitRecord) {
                                        visitRecord.Time = formatDateTime(new Date(visitRecord.Time));
                                    });
                                    self.visitrecords = self.persons[0].visitRecords;
                                    visitTimes = self.visitrecords.length;

                                    self.evervisitTimes = "欢迎您第 " + visitTimes + " 次访问";



                                    console.log(fromJSON(toJSON(self.visitrecords[0])));
                                    console.log(photowall.file);

                                });
                            });
                        });
                        
                    }
                },
                search : function(){
                   var self = this;
                   var postData = {
                        name : self.search_name
                    };
                    var request = new Request ('/face_recognition/search');
                    console.log(self.selected);

                    self.options.forEach( option => {
                        if(option.value == self.selected){
                            if (option.type == 'default') {
                                
                                return;
                            }
                            else{
                                if(option.type == "city"){
                                    postData.city = option.description;
                                }
                                else{
                                    postData.continent = option.description;
                                }
                            }
                        }
                    });
                   
                    if(!postData.name && postData.city == null && postData.continent ==null){
                        self.warning = "请输入姓名或单位";
                        $('.w_alert').show();
                
                        return;
                    }
                    else {
                        $(".g_search .loading").addClass('active');
                        $(".g_search .tips").text('查询中');
                        console.log(fromJSON(toJSON(postData)));
                        request.postJSON(postData, function(result) {
                            if(!result.successful){
                                console.log('search failed');
                                return;
                            }
                            
                            setTimeout(function() {
                                $(".g_search .loading").removeClass('active').hide();
                                $(".g_search .result .list").show();
                            }, 2000);
                            self.persons = result.persons;
                            
                        });
                    }
                },
                findVisitrecord : function(recordIndex){
                    console.log(recordIndex);
                    var self = this;
                    console.log(fromJSON(toJSON(self.persons[recordIndex])));
                    self.id = self.persons[recordIndex].Id;
                    self.visitname = self.persons[recordIndex].name;
                    self.visitaddress = self.persons[recordIndex].address;
                    self.visitimg = self.persons[recordIndex].imagePath;
                    
                    showBox('.g_search_tl');
                    self.persons[recordIndex].visitRecords.forEach(function(visitRecord) {
                        visitRecord.Time = formatDateTime(new Date(visitRecord.Time));
                    });
                    self.visitrecords = self.persons[recordIndex].visitRecords;
                    visitTimes = self.visitrecords.length;

                    self.evervisitTimes = "欢迎您第 " + visitTimes + " 次访问";

                    console.log(fromJSON(toJSON(self.visitrecords[0])));
                },
                scaleVisitRecord: function(recordIndex) {
                    var visitRecord = this.visitrecords[recordIndex];
                    $('.image-area img').attr('src', visitRecord.imagePath);
                    $('.image-area').show();
                }
            }
        });

        // TODO 点击外部关闭窗口并且按钮解除diabled

        $('.image-area').click(function() {
            $('.image-area').hide();
            return false;
        });
        $(".g_search_tl .close").click( function(){
            hideBox('.g_search_tl');
        });

        $('.g_snapshot .pic').click(function(e) {
            $('.g_snapshot').hide();
        });
        $('.w_alert .btn').click(function(e) {
            $('.w_alert').hide();
        })
        $('.container').click(function(e) {
            $('.training').hide();
            $('.loading').hide();
        })
        $('.training').click(function(e){
            return false;
        });
        $('.loading').click(function(e) {
            return false;
        });
        $('.w_alert').click(function(e) {
            return false;
        });
    })(); 
