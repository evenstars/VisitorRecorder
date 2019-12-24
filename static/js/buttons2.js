   

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

        $(".g_search_tl .close").click( function(){
            hideBox('.g_search_tl');
        })

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
                        console.log('slef',self.file);
                        setTimeout(function() {
                            $('.g_gallery .g1').liMarquee({
                                direction: 'up',
                                drag: false,
                                hoverstop: false,
                                circular: true
                            });
                            $('.g_gallery .g2').liMarquee({
                                direction: 'up',
                                drag: false,
                                hoverstop: false,
                                circular: true
                            });
                            $('.g_gallery .g3').liMarquee({
                                direction: 'up',
                                drag: false,
                                hoverstop: false,
                                circular: true
                            });
                        }, 200);
                        setTimeout( // 照片流拖拽
                            function() {
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

                                $('.g_gallery li').on('mousedown', function(e) {
                                    var target = $(e.currentTarget);
                                    if(target.hasClass('scale')) {
                                        target.removeClass('scale');
                                        target.removeClass('draging');
                                        playScroll();
                                        return;
                                    }
                                    $('.g_gallery .draging').removeClass('draging');
                                    $('.g_gallery .scale').removeClass('scale');
                                    pauseScroll();

                                    var all = collectAllPosition();
                                    var galleryWidth = $('.g_gallery').outerWidth();
                                    var galleryHeight = $('.g_gallery').outerHeight();

                                    var offset = target.offset();
                                    var height = target.outerHeight();
                                    var width = target.outerWidth();

                                    var dragel = target.clone();

                                    status.pick = target;

                                    dragel.css({
                                        top: offset.top,
                                        left: offset.left,
                                        height: height,
                                        width: width,
                                        position: 'absolute',
                                        zIndex: 11
                                    });
                                    dragel.addClass('draging');

                                    var placeholder = target.clone();
                                    placeholder.css({
                                        height: height,
                                        width: '100%',
                                        opacity: 0
                                    });

                                    status.placeholder = placeholder;

                                    status.x = e.pageX;
                                    status.y = e.pageY;
                                    status.start = true;
                                    status.append = false;


                                    $(document.body).on('mousemove.drag', function(e) {
                                        if(!status.append) {
                                            target.addClass('draged');
                                            $('.g_gallery').append(dragel);
                                            status.append = true;
                                        }
                                        status.move = true;
                                        var move = {
                                            x: e.pageX,
                                            y: e.pageY
                                        };

                                        var diff = {
                                            x: move.x - status.x,
                                            y: move.y - status.y
                                        };

                                        var after = {
                                            left: offset.left + diff.x,
                                            top: offset.top + diff.y
                                        }

                                        if(after.left < 0) {
                                            after.left = 0;
                                        }

                                        if(after.top < 0) {
                                            after.top = 0;
                                        }

                                        if((after.left + width) > galleryWidth) {
                                            after.left = galleryWidth - width;
                                        }

                                        if((after.top + height) > galleryHeight) {
                                            after.top = galleryHeight - height;
                                        }

                                        dragel.css(after);

                                        var center = {
                                            x: after.left + width/2,
                                            y: after.top + height/2
                                        };

                                        for(var i = 0, max = all.length; i < max; i++) {
                                            var item = all[i];

                                            if(center.x > item.left & center.x < (item.left + item.width)) { // x范围内
                                                if(center.y > item.top & center.y < (item.top + item.height)) { // x范围内

                                                    if(status.el == status.pick) {
                                                        status.moveto = null;
                                                        status.placeholder.remove();
                                                    } else {
                                                        status.moveto = item.el;
                                                        item.el.before(status.placeholder);
                                                    }
                                                    break;
                                                }
                                            }
                                        }

                                        return false;
                                    });

                                    $(document.body).on('mouseup.drag', function() {
                                        dragel.remove();
                                        status.placeholder.remove();
                                        if(!status.append) {
                                            target.addClass('scale');
                                            target.addClass('draging');
                                        } else {
                                            if(status.moveto) {
                                                status.moveto.before(status.pick);
                                            }
                                            playScroll();
                                        }
                                        status.pick.removeClass('draged');

                                        $(document.body).off('mousemove.drag');
                                        $(document.body).off('mouseup.drag');
                                    });
                                });
                            },200);
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
        //训练
        var vm = new Vue({
            el : '#g_camera',
            data : {
                img1: '',
                img2: '',
                img3: '',
                img4: '',
                img: './images/p1.png',
                timer1: null,
                options: option,
                selected: ''
            },
            methods : {
                snap : function() {
                    var self = this;
                    buttonTimesTrain ++;
                    if(buttonTimesTrain % 2 == 1){
                        $('.loading').hide();
                        $('.training').hide();
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
                    }
                    else{
                        clearInterval(self.timer1);
                        self.timer1 = null;
                        $('.loading').show();
                        $('.training').hide();
                        hideVideo();
                        hideSearch();
                        var request = new Request('/face_recognition/snapping');
                        request.getJSON( function(result) {
                            if(!result.successful) {
                                console.log("snap err");
                                return;
                            }
                            self.img1 = '/training/'+result.data.path[0];
                            self.img2 = '/training/'+result.data.path[1];
                            self.img3 = '/training/'+result.data.path[2];
                            self.img4 = '/training/'+result.data.path[3];
                            token = result.data.token;                            
                            setTimeout(function() { // 模拟拍照延时
                                // 无论是否拍照成功都需要撤下loading
                                $('.loading').hide();
                                $('.training').show();
                            }, 250);
                        });
                    }
                },
                training : function() {
                    var self = this;
                    var request = new Request('/face_recognition/training');
                    var postData = {
                        name: self.name,
                        address: self.address,
                        token: token
                    };
                    self.options.forEach( option => {
                        if(option.value == self.selected){
                            console.log(option);
                            if(option.type == 'city'){
                                 postData.city = option.description;
                            }
                            else{
                                postData.continent = option.description;
                            }
                            request.postJSON(postData, function(result) {
                                if(!result.successful){
                                    console.log("trianing failed");
                                    alert('训练失败');
                                    return;
                                }
                                alert("训练成功");
                            });
                        }
                    });
                    
                }
            }
        });

        var buttonTimesRecognize = 0
        //识别
       var container = new Vue({
            el : '#container',
            data : {
                recognizeimg : './images/p1.png',
                timer2: null,
                recognizepic1: './images/p1.png',
                recognizepic2: './images/p2.png',
                reocgnizename: '',
                recognizeaddress: '',
                persons : [],
                options: option,
                visitimg: './images/p1.png',
                visitname: '',
                visitaddress: '',
                visitrecords: [],
                id: -1
            },
            methods : {
                search : function(){
                   var self = this;
                   var postData = {
                        name : self.search_name
                    };
                    $(".g_search .loading").addClass('active');
                    $(".g_search .tips").text('查询中');
                    var request = new Request ('/face_recognition/search');
                    console.log(self.selected);

                    self.options.forEach( option => {
                        if(option.value == self.selected){
                            if(option.type == "city"){
                                postData.city = option.description;
                            }
                            else{
                                postData.continent = option.description;
                            }
                        }
                    });
                   
                    if(!postData.name && self.selected == null){
                        alert("请输入姓名或单位");
                        return;
                    }
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

                    console.log(fromJSON(toJSON(self.visitrecords[0])));

                    

                },
                camera : function() {
                    var self = this;
                    buttonTimesRecognize ++;
                    if(buttonTimesRecognize % 2 == 1){
                        self.timer2 = setInterval(function(){
                        var req = new Request('/face_recognition/realtime');
                            req.getJSON( function(result) {
                                if ( self.timer2 == null ) {
                                    return;
                                }
                                if(!result.successful) {
                                    console.log("err");
                                    return;
                                }
                                console.log('times',times ++);
                                self.recognizeimg = 'http://192.168.62.101:8080/snapping/' + result.data.path[0];
                            });
                        }, 1000);
                    }
                    else{
                        clearInterval(self.timer2);
                        var request = new Request('/face_recognition/recognition');
                        request.getJSON( function(result) {
                            if( !result.successful ){
                                console.log("snap err");
                                alert("识别失败");
                                return;
                            }
                            $(".g_snapshot").css('display','block');
                            self.recognizepic1 = result.data.detectedPersons[0].imagePath;
                            self.recognizepic2 = result.data.detectedPersons[0].imagePath;
                            self.recognizename = result.data.detectedPersons[0].name;
                            self.recognizeaddress = result.data.detectedPersons[0].address;
                            console.log(self.recognizename);
                            photowall.file[1].$set('1', result.data.detectedPersons[0].imagePath);
                            console.log(photowall.file);
                           
                        });
                    }
                }
            }
        });
        $('.g_snapshot .pic').click(function(e) {
            $('.g_snapshot').hide();
        });
        
    })(); 
