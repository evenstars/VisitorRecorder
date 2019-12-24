'use strict';

module.exports = {
    state: {
        show: false,
        name: '清华大学合肥公共安全研究院',
        src: '/movies/introduction.mp4'
    },
    mutations: {
        // 修改
        'video.setInfo': function(state, info) {
            state.name = info.name;
            state.src = info.src
        },
        'video.show': function(state) {
            state.show = true;
        },
        'video.hide': function(state) {
            state.show = false;
        }
    },
    actions: {
        'video.toggle': function(context, isShow) {
            if(isShow) {
                context.commit('video.show');
            } else {
                context.commit('video.hide');
            }
        }
    }
};