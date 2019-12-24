/*
	功能：小屏幕vue组件
 */

var container = new Vue({
	el: '#container',
	data: {
		address: '',
		big_img: '',
		img_date: '',
		visit_time: 0,
		small_img: 'img/smile.png',
		avatar_name: '',
		visit_record: [],
		token: '',
        qrcode: '',
        inscriptionFromKeyboard:'yuanlai',
		countries:null,
        provinces:null,
		cities:null,
		chosen_country:"中国",
		chosen_province:"选择省份",
		chosen_city:"选择城市",
		hand_inscription:null
	},
	created: function () {
		const s = document.createElement('script');
		s.type="text/javascript";
		s.src = 'js/China_data.js';
		document.body.appendChild(s);
	},
	methods: {
		send: function () {
			var self = this;
			self.playSnap();
		    countdown(3, function() {
                var request = new Request('/face_recognition/recognition');
                request.postJSON({}, function(result) {
					$(".panel1").hide();
                    $("#input_change").show();
                    $("#inscription_area").show();
                    if (result.successful) {
						// 再次到访
						self.playVisit();
                        self.getTimeLine(result.data.detectedPerson.mid);
						sessionStorage.setItem("id", result.data.detectedPerson.mid);
						$(".panel2").show();
						$(".panel3").show();
						canvasShow();
                    } else {
						//首次到访
						self.playTrain();
						self.token = result.data.token;
						self.countries = ['中国','亚洲其他国家','欧洲','非洲','南美洲','北美洲','大洋洲'];
						self.provinces = getChinaInf()['provinces'];

						$(".panel4").show();
						self.big_img = result.data.image;
                        canvasShow();
						canvasShow1();
					}
                });
            });
		},
		// 与后端交互，取得到访记录
		getTimeLine: function (id) {
			var self = this;
            var data = {
                id: id
            };
            $.ajax({
                url: '/face_recognition/timeline',
                type: 'get',
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                success: function(result) {
                    if (result.successful) {
						console.log(result.data.detectedPerson);
                    	self.visit_record = result.data.detectedPerson.visitRecords;
                        var len = self.visit_record.length;
						for(var i=0;i<result.data.detectedPerson.visitRecords.length;i++) {
							path = result.data.detectedPerson.visitRecords[i].imagePath;
							recognize_index = path.indexOf('/recognize');
							if (recognize_index == 0 && path.indexOf('null') < 0) {
								self.small_img = path;
								break;
							}
						}
                        self.img_date = self.visit_record[0].Time.substr(0, 10);
                        //判断小图像显示内容，题词或首次到访照片
                        //小图像显示第一张照片
                        self.big_img = result.data.detectedPerson.imagePath;
						$("#inscription-a").html("提交题词");
						for(var i=0;i<result.data.detectedPerson.visitRecords.length;i++){
							path = result.data.detectedPerson.visitRecords[i].imagePath;
							inscription_index = path.indexOf('/inscription');
							if(inscription_index == 0 && path.indexOf('null')<0){
								//如果有过手动输入题词
								console.log("inscription available");
								self.hand_inscription = path;
								$("#inscription-a").html("更新题词") ;
								$("#inscription_show").show();
								$("#input_change").hide();
								break;
							}
						}
						// 判断，有名字则显示名字，无名字则显示签名照片
						if(result.data.detectedPerson.name){
							self.avatar_name = result.data.detectedPerson.name;
							$('#name_signature').hide();
							$('#name_input').show();
						}else {
							self.avatar_name = result.data.detectedPerson.signature;
							$('#name_signature').show();
							$('#name_input').hide();
						}
                        self.address = self.visit_record[0].Person.address;
                        self.visit_time = result.data.detectedPerson.visitTimes;
                        self.qrcode = result.data.detectedPerson.qrcode;

						//取得最新键盘签名

                        if(result.data.detectedPerson.keyboardInscription){
                            self.inscriptionFromKeyboard = result.data.detectedPerson.keyboardInscription;
                            $("#small_pic").css("top","460px");
                        }else{
							self.inscriptionFromKeyboard = '';
							$("#small_pic").css("top","435px");
						}
                        // for(var i=0;i<self.visit_record.length;i++){
                        //     if(self.visit_record[i].keyboardInputInscription){
                        //         self.inscriptionFromKeyboard = self.visit_record[i].keyboardInputInscription;
                        //         $("#small_pic").css("top","460px");
                        //         break;
                        //     }
                        // }
                        $(".back").hide();
                        $(".panel3").show();
                    }
                }
            });
		},
		//确定国家时相关点击操作
		ensure_country:function(event){
			country_val=$(event.target).text();
			this.chosen_country = country_val;
			if(this.chosen_country != '中国'){
				this.provinces= ['其他'];
				this.chosen_province = '其他';
				$('#choose_city').attr('disabled',false);
				this.cities = ['其他'];
				this.chosen_city='其他';
			}else{
				this.provinces = getChinaInf()['provinces'];
				this.chosen_province='选择省份';
				$('#choose_city').attr('disabled',true);
				this.cities = null;
				this.chosen_city='选择城市';
			}
		},
		//确定省份点击事件
		ensure_province:function(event){
			if(this.chosen_country != '中国'){
				return;
			}
			province_val = $(event.target).text();
			this.chosen_province = province_val;

			//找到对应省份城市
			for(var i=0;i<this.provinces.length;i++){
				if(this.provinces[i]['provinceName'] == province_val){
					this.cities = this.provinces[i]['citys'];
					break;
				}
			}
			$('#choose_city').attr('disabled',false);
		},
		//确认城市点击事件
		ensure_city:function(event){
			if(this.chosen_country !='中国'){
				return ;
			}
			city_val = $(event.target).text();
			this.chosen_city = city_val;
		},
		//保存信息点击事件
		saveInfo: function () {
			var self = this;
			if (isDrawed == false) {
                $("#signature_err").fadeIn();
				countdown(2, function() {
                    $("#signature_err").fadeOut();
				});
				return; 
			}else if (self.chosen_city == "选择城市") {
                $("#area_err").fadeIn();
                countdown(2, function() {
                    $("#area_err").fadeOut();
                });
				return;
			}
			// else if( !isInscript1 && $("#txt_Search").val()==""){
             //    $("#inscription_err").fadeIn();
             //    countdown(2, function() {
             //        $("#inscription_err").fadeOut();
             //    });
			// 	return;
			// }

			var province = this.chosen_province;
			var country = this.chosen_country == "亚洲其他地区"?"亚洲":this.chosen_country;
			var city = this.chosen_city;
			var signature = $('#myCanvas2')[0].toDataURL().substring(22);//签名
			var inscription;
			if (!isInscript1) {
				inscription = null;
			} else {
				inscription = $('#myCanvas1')[0].toDataURL().substring(22);//题词
			}
			//获取键盘输入题词
			var keyboardInputContent = ($("#txt_Search").val()=="")?null:$("#txt_Search").val();
     		var request = new Request('/face_recognition/training');
            var postData = {
                name: "",
                address: '',
                province: province,
				city: city,
                token: self.token,
                signature: signature,
				inscription: inscription,
				keyboard_inscription:keyboardInputContent,
				country:country
            };
            request.postJSON(postData, function(result) {
                if (result.successful) {
					$("#save_success").fadeIn();
					countdown(2, function() {
                        $("#save_success").fadeOut();
						self.BACK();
						this.BACK();
					});   
                } else {
                    $("#train_err").fadeIn();
                    countdown(1, function() {
                        $("#train_err").fadeOut();
                    });
				}
            });
		},
		rePhoto: function () {
			this.BACK();
		},
		BACK: function () {
			$("#txt_Search").val("");
			this.chosen_country="中国";
			this.provinces = getChinaInf()['provinces'];
			this.chosen_province="选择省份";
			this.chosen_city="选择城市";
			$("#choose_city").attr('disabled',true);
			clearCanvas();
			isDrawed = false;// 判断签名是否为空，canvas全局变量
			isInscript1 = false; //判断题词是否为空
			isResigned = false;  // 判断重新签名
			$(".panel1").show();
			$(".tip").show();
			$(".camera").show();
			$(".panel2").hide();
			$(".panel3").hide();
			$(".panel4").hide();
			$(".save_success").hide();
            $("#input_change").hide();
            $(".keyboard_inputarea").val("");
            $("#inscription_area").hide();
			if($("#input_change").text()=="切换手写"){
				$("#input_change").click();
			}
            $("#save_success").hide();
            $("#train_err").hide();
            $("#signature_err").hide();
            $("#area_err").hide();
            $("#inscription_err").hide();
			$("#inscription_show").hide();
			$("#inscription_a").val = "提交题词";
			this.inscriptionFromKeyboard = '';
		},
		inscription: function () {
			if($("#inscription-a").text() == "更新题词"){
				$("#input_change").show();
				$("#inscription_show").hide();
				$("#inscription-a").html("提交题词");
				return;
			}

			var canvas_container = $('#inscription_area');
			var ins_canvas =$(".myCanvas")[2];
			console.log($(".myCanvas").length);
			var context = ins_canvas.getContext("2d");
			context.clearRect(0,0,ins_canvas.width,ins_canvas.height);
			context.fillStyle = 'black';
			context.fillRect(0,0,ins_canvas.width,ins_canvas.height);
			context.strokeStyle = "yellow";
			context.strokeRect(0, 0, ins_canvas.width,ins_canvas.height);

			//提交题词时候
            if(!isInscript1 && $("#txt_Search").val()==""){
                $("#inscription_empty").fadeIn();
                countdown(2, function() {
                    $("#inscription_empty").fadeOut();
                });
                console.log("no new inscription");
				if(this.hand_inscription){
					if($("#input_change").text()=='切换手写'){
						$("#input_change").click();
					}
					$("#input_change").hide();
					$("#inscription_show").show();
					$("#inscription-a").html("更新题词");
				}
                return;
            }
			//获取更新题词
			var self = this;
			var id = sessionStorage.getItem("id");
			var inscription;
			if (!isInscript1) {
				inscription = null;
			} else {
                inscription = $('#myCanvas1')[0].toDataURL().substring(22);//题词
            }
            var keyboardInputContent = ($("#txt_Search").val()=="")?null:$("#txt_Search").val();
			//提交题词并更新
        	var request = new Request('/face_recognition/inscription');
            var postData = {
                id: id,
                inscription: inscription,
                keyboardInputContent:keyboardInputContent
            };
            request.postJSON(postData, function(result) {
                if (result.successful) {
                    console.log('update inscription successfully');
                    $("#save_inscription_success").fadeIn();
                    countdown(1, function() {
						$("#txt_Search").val("");
						if($("#input_change").text()=="切换手写"){
							$("#input_change").click();
						}

						// 擦去canvas元素
						// var canvas_container = $('#inscription_area');
						// var canvas = $('#mycanvas1');
						// canvas_container.remove(canvas);
						// clearCanvas();
						// canvas_container.append(canvas);

						isInscript1 = false; //判断题词是否为空
						self.getTimeLine(id);
                        $("#save_inscription_success").fadeOut();
                    });
                }
            });
		},
		resign: function () {
			var self = this;
			if (!isReSignShow) {
				$('.canvas2').show();
				canvasShow2();
				$('#resign-a').html("提交签名");
			} else {
				if(isResigned){
					var signature = $('#myCanvas3')[0].toDataURL().substring(22);//重新签名
					var id = sessionStorage.getItem("id");
					var request = new Request('/face_recognition/signature');
					var postData = {
						id: id,
						signature: signature
					};
					request.postJSON(postData, function(result) {
						if (result.successful) {
							$('.canvas2').hide();
							clearCanvas();
							$('#resign-a').html("重新签名");
							isReSignShow = false; //是否展示
							isResigned = false;  // 是否签名
                            $("#save_signature_success").fadeIn();
                            countdown(2, function() {
								self.getTimeLine(id);
                                $("#save_signature_success").fadeOut();
                            });
						}
					});
				}else{
                    $("#signature_empty").fadeIn();
                    countdown(2, function() {
                        $("#signature_empty").fadeOut();
                    });
					console.log('no new signature');
                    $('.canvas2').hide();
                    clearCanvas();
                    $('#resign-a').html("重新签名");
                    isReSignShow = false; //是否展示
                    isResigned = false;  // 是否签名
				}
			}
		},
        playSnap: function() {
            var audio = $('.audio-snap')[0];
            audio.play();
        },
        playTrain: function() {
            var audio = $('.audio-train')[0];
            audio.play();
        },
        playVisit: function() {
            var audio = $('.audio-visit')[0];
            audio.play();
        }
	}
});
