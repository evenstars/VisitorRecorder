'use strict';

const $ = require('jquery');

module.exports = {
    state: {
        list: [] // 二维数组
    },
    mutations: {
        // 设置照片流
        'gallery.setList': function(state, files) {
            var list = [];
            // 通过action获取到数据后，在mutation里格式化成下列数据格式后再放到state里
           //console.log('aaaaa',files);
            for (var i = 0; i < files.length; i++) {
                var sub_file = files[i];
                var temp_list = [];
                for (var j = 0; j < sub_file.length; j++) {
                    temp_list.push({
                        name: '',
                        university: '',
                        src: sub_file[j],
                        office: '',
                        avatar: ''
                    });
                }
                list.push(temp_list);
            }
            state.list =  list;
          /*  $(".w_gallery > div > div").innerHTML = '';
            console.log(state.list)*/
        }
    },
    actions: {
        // 获取照片流
        'gallery.fetch': function(context,a) {
            // todo: 需要联调,通过ajax获取照片流数据
            var files = [];
            $.ajax({
                url: '/home/photowall?a='+a.area,
                type: 'get',
                contentType: 'application/json',
                data: '',
                dataType: 'json',
                success: function (result) {
                    if (result.successful) {
                        //console.log(result)
                        var files = result.data.files;
                        context.commit('gallery.setList', files);
                    }
                }
            });
            // context.commit('gallery.setList', files);
        }
    }
};