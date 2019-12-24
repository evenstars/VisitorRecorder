'use strict';

module.exports = {
    state: {
        name: '',
        university: '',
        office: '',
        time: '',
        src: '',
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        show: false,
        origin: 50,
        scale: 1,
        backInfo: {}
    },
    mutations: {
        'previewer.setPosition': function(state, info) {
            var center = {
                left: info.offset.left + info.offset.width/2,
                top: info.offset.top + info.offset.height/2
            };

            var left = center.left - info.width/2 - 6; // 6像素边距
            var top = center.top - info.height/2 - 36; // 36像素顶边 

            var maxLeft = left + info.width + 6;
            var maxTop = top + info.height + 92 + 36; // 92像素底边

            state.scale = info.offset.width / info.width;
            state.left = left;
            state.top = top;

            state.width = info.width;
            state.height = info.height;

            state.origin = (info.height/2+36)/(info.height + 36 + 92) * 100;

            state.backInfo = {
                scale: state.scale,
                left: state.left,
                top: state.top
            };

            if(left < 0) {
                left = 0;
            }
            if(top < 0) {
                top = 0;
            }
            if(maxLeft > 2560) {
                left = 2560 - info.width - 6 * 2;
            }
            if(maxTop > 1080) {
                top = 1080 - info.height - 92 - 36;
            }

            state.timeout = setTimeout(() => {
                state.left = left;
                state.top = top;
                state.scale = 1;
            }, 100);
        },
        'previewer.animationHide': function(state) {
            state.scale = state.backInfo.scale;
            state.top = state.backInfo.top;
            state.left = state.backInfo.left;
            setTimeout(() => {
                state.show = false;
            }, 400);
        },
        'previewer.hide': function(state) {
            state.show = false;
        },
        'previewer.show': function(state, info) {
            state.show = true;
            state.name = info.name || '';
            state.university = info.university || '';
            state.office =  info.office || '';
            state.time = info.time || '';
            state.src = info.src || '';
            state.width = info.width;
            state.height = info.height;
        },
        'previewer.reset': function(state) {
            state.name = '';
            state.university = '';
            state.office = '';
            state.time = '';
            state.src = '';
            state.width = 0;
            state.height = 0;
        }
    },
    actions: {
        'previewer.hide': function(context) {
            context.commit('previewer.hide');
        },
        'previewer.show': function(context, info) {
            context.commit('previewer.reset');
            context.commit('previewer.hide');

            let img = new Image();

            img.onload = function() {
                var result = Object.create(info);
                var maxWindowHeight = Math.ceil(window.innerHeight * 0.6);
                var maxWindowWidth = Math.ceil(window.innerWidth * 0.6);

                result.width = img.width;
                result.height = img.height;

                // 限制最大宽度
                if(result.height > maxWindowHeight) {
                    result.width = Math.ceil(result.width / result.height * maxWindowHeight);
                    result.height = maxWindowHeight;
                }
                // 限制最大高度
                if(result.width > maxWindowWidth) {
                    result.height = Math.ceil(result.height / result.width * maxWindowWidth);
                    result.width = maxWindowWidth;
                }

                setTimeout(() => {
                    context.commit('previewer.show', result);
                    context.commit('previewer.setPosition', result);
                }, 10);
            };
            img.src = info.src;

        }
    }
}