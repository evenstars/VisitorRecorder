'use strict';

const $ = require('jquery');

module.exports = {
    state: {
        ready: false,
        focus: false,
        focuss:false,
        claAll:'.bj',
        cityHefei: 0,
        cityBeijing: 0,
        cityNanjing: 0,
        citySuzhou: 0,
        cityHangzhou: 0,
        cityShanghai: 0,
        cityGuangzhou: 0,
        cityChengdu: 0,
        cityXian: 0
    },
    mutations: {
        'earth.focus': function(state, params) {
            state.focus = params;
        },
        'earth.ready': function(state, params) {
            state.ready = params;
        },
        'earth.updateCity': function(state, cities) {
            console.log(cities);
            state.cityHefei = cities[2];
            state.cityBeijing = cities[0];
            state.cityNanjing = cities[1];
            state.citySuzhou = cities[8];
            state.cityHangzhou = cities[5];
            state.cityShanghai = cities[3];
            state.cityGuangzhou = cities[4];
            state.cityChengdu = cities[7];
            state.cityXian = cities[6];
        }
    },
    actions: {
        'earth.fetch': function (context) {
            $.ajax({
                url: '/home/count/city',
                type: 'get',
                contentType: 'application/json',
                data: '',
                dataType: 'json',
                success: function (result) {
                    if (result.successful) {
                        var cities = result.data.cities;

                        context.commit('earth.updateCity', cities);

                        var visitorNum = 0;
                        cities.forEach(function (count) {
                            visitorNum += count;
                        });
                        context.commit('updateVisitor', visitorNum);
                    }
                }
            });
        }
    }
};