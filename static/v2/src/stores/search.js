'use strict';

const $ = require('jquery');

module.exports = {
    state: {
        show: false,
        showResult: false,
        showDetail: false,
        result: [],
        requesting: false,
        detail: {},
        options: [
            {
                key: '北京',
                value: '北京'
            }, {
                key: '广东省',
                value: '广东省'
            }, {
                key: '上海',
                value: '上海'
            }, {
                key: '天津',
                value: '天津'
            }, {
                key: '重庆',
                value: '重庆'
            }, {
                key: '辽宁省',
                value: '辽宁省'
            }, {
                key: '江苏省',
                value: '江苏省'
            }, {
                key: '湖北省',
                value: '湖北省'
            }, {
                key: '四川省',
                value: '四川省'
            }, {
                key: '陕西省',
                value: '陕西省'
            }, {
                key: '河北省',
                value: '河北省'
            }, {
                key: '山西省',
                value: '山西省'
            }, {
                key: '河南省',
                value: '河南省'
            }, {
                key: '吉林省',
                value: '吉林省'
            }, {
                key: '黑龙江省',
                value: '黑龙江省'
            }, {
                key: '内蒙古',
                value: '内蒙古'
            }, {
                key: '山东省',
                value: '山东省'
            }, {
                key: '安徽省',
                value: '安徽省'
            }, {
                key: '浙江省',
                value: '浙江省'
            }, {
                key: '福建省',
                value: '福建省'
            }, {
                key: '湖南省',
                value: '湖南省'
            }, {
                key: '广西省',
                value: '广西省'
            }, {
                key: '江西省',
                value: '江西省'
            }, {
                key: '贵州省',
                value: '贵州省'
            }, {
                key: '云南省',
                value: '云南省'
            }, {
                key: '西藏',
                value: '西藏'
            }, {
                key: '海南省',
                value: '海南省'
            }, {
                key: '甘肃省',
                value: '甘肃省'
            }, { 
                key: '宁夏',
                value: '宁夏'
            }, { 
                key: '青海省',
                value: '青海省'
            }, {
                key: '新疆',
                value: '新疆'
            }, {
                key: '香港',
                value: '香港'
            }, {
                key: '澳门',
                value: '澳门'
            }, {
                key: '台湾',
                value: '台湾'
            }, {
                key: '北美洲',
                value: '北美洲'
            }, {
                key: '南美洲',
                value: '南美洲'
            }, {
                key: '非洲',
                value: '非洲'
            }, {
                key: '亚洲',
                value: '亚洲'
            }, {
                key: '欧洲',
                value: '欧洲'
            }, {
                key: '大洋洲',
                value: '大洋洲'
            }
        ]
    },
    mutations: {
        'search.hideResult': function(state) {
            state.showResult = false;
        },
        // 展示搜索框
        'search.show': function(state) {
            state.show = true;
            state.showResult = false;
            state.showDetail = false;
        },
        // 隐藏搜索框
        'search.hide': function(state) {
            state.show = false;
        },
        // 设置搜索结果
        'search.setSearchResult': function(state, list) {
            // 返回的ajax
            state.show = false;
            state.showResult = true;
            state.showDetail = false;
            state.result = list;
        },
        'search.returnFromDetail': function(state) {
            // 返回的ajax
            if ( state.showDetail ) {
                state.show = false;
                state.showResult = true;
                state.showDetail = false;
            }
        },
        // 请求状态
        'search.setRequestStatus': function(state, params) {
            state.requesting = params;
        },
        'search.setDetail': function(state, info) {
            state.show = false;
            state.showResult = false;
            state.showDetail = true;
            state.detail = info;
        },
        'search.hideDetail': function(state) {
            state.showDetail = false;
        }
    },
    actions: {
        // 切换搜索框展示
        'search.toggle': function(context, isShow) {
            if(isShow) {
                context.commit('search.show');
            } else {
                context.commit('search.hide');
                context.commit('search.hideResult');
                context.commit('search.hideDetail');
            }
        },
        // 开始搜索
        'search.search': function(context, params) {
            context.commit('search.setRequestStatus', true);
            // todo, 发起ajax返回结果
            var list = [];
            var selected = {
                province: params.area,
            };
            $.ajax({
                url: '/home/search',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(selected),
                dataType: 'json',
                success: function (result) {
                    if (result.successful) {
                        var persons = result.persons;
                        console.log(persons);
                        list = persons.map(function (p) {
                            return {
                                id: p.mid,
                                src: p.imagePath,
                                name: p.name,
                                university: p.address,
                                office: '',
                                avatar: p.imagePath
                            };
                        });
                    }
                }
            });

            setTimeout(() => {
                if(!context.state.show) {
                    return;
                }
                context.commit('search.setSearchResult', list);
            }, 1000);
        },
        // ajax请求详细信息
        'search.setDetail': function(context, info) {
            // 请求ajax
            var timeline = [];
            var qr_code = '';
            var src = '';
            var url = '/face_recognition/timeline?id=' + info.id;
            $.ajax({
                url: url,
                type: 'get',
                contentType: 'application/json',
                dataType: 'json',
                success: function (result) {
                    if (result.successful) {
                        var visit_record = result.data.detectedPerson.visitRecords;
                        qr_code = result.data.detectedPerson.qrcode;
                        src = result.data.detectedPerson.imagePath;
                        timeline = visit_record.map(function (v) {
                            return {
                                src: v.imagePath,
                                name: v.name,
                                university: v.address,
                                office: '',
                                time: formatDateTime(new Date(v.Time)),
                                avatar: v.imagePath
                            };
                        });
                        timeline[0].time = '';
                        console.log("时间轴：");
                        console.log(timeline[0]);
                        var result = Object.create(info);

                        result.qrcode = qr_code;
                        result.timeline = timeline;
                        result.src = src;

                        context.commit('search.setDetail', result);
                    }
                }
            });
        }
    }
};

function formatDateTime(date) {
    return '' + date.getFullYear() + '-' + 
        paddingZero(date.getMonth() + 1, 2) + '-' + 
        paddingZero(date.getDate(), 2) + ' ' +
        paddingZero(date.getHours(), 2) + ':' +
        paddingZero(date.getMinutes(), 2);
}

function paddingZero(number, width) {
    var numberString = String(number);
    if ( numberString.length < width ) {
        numberString = '0'.repeat(width - numberString.length) + numberString;
    }

    return numberString;
}
