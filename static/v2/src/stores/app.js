'use strict';

const $ = require('jquery');
const createWebSocketPlugin = require('./plugins/websocketPlugins')
var wsUri = "ws://" + window.location.hostname + ":8888";
console.log(wsUri);
var ws = new WebSocket(wsUri);
ws.onopen = function () {
    console.log("ws open");
}

var socket_plugin = createWebSocketPlugin(ws);

module.exports = {
    state: {
        time: {},
        visitorNum: 0,
        visitorYear: 0
    },
    modules: {
        gallery: require('./gallery.js'),
        video: require('./video.js'),
        search: require('./search.js'),
        previewer: require('./previewer.js'),
        visitor: require('./visitor.js'),
        earth: require('./earth.js')
    },
    mutations: {
        // 页面展示时间
        'updateTime': function (state) {
            let time = {};

            var date = new Date();

            time.year = date.getFullYear();
            time.month = date.getMonth() + 1;

            if (time.month < 10) {
                time.month = '0' + time.month;
            }

            time.day = date.getDate();

            if (time.day < 10) {
                time.day = '0' + time.day;
            }

            time.hour = date.getHours();

            if (time.hour < 10) {
                time.hour = '0' + time.hour;
            }

            time.minute = date.getMinutes();

            if (time.minute < 10) {
                time.minute = '0' + time.minute;
            }

            time.second = date.getSeconds();

            if (time.second < 10) {
                time.second = '0' + time.second;
            }

            state.time = time;
        },
        // 访客数
        'updateVisitor': function (state, num) {
            num = Number(num) + 599; // 加上一个默认基数
            // 千分位处理
            state.visitorNum = String(num).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                return s + ',';
            });
        },
        // 今年访客数
        'updateVisitorYear': function (state, num) {
            state.visitorYear = num;
        }
    },
    actions: {
        'updateVisitor': function (context) {
            // todo联调，在这里通过ajax获取访客数
            // context.commit('updateVisitorYear', 2631);
        }
    },
    plugins: [socket_plugin]
}