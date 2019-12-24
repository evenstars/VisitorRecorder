'use strict';

var worldMap = new Vue({
    el: '.g_area',
    data: {
        continents: [
        {
            name: '北美洲',
            top: '76.5px',
            left: '165.75px',
            num: 0,
            extra: 31
        },
        {
            name: '南美洲',
            top: '300.5px',
            left: '303px',
            num: 0,
            extra: 0
        },
        {
            name: '非洲',
            top: '229.5px',
            left: '541.5px',
            num: 0,
            extra: 0
        },
        {
            name: '欧洲',
            top: '64.5px',
            left: '600.75px',
            num: 0,
            extra: 17
        },
        {
            name: '亚洲',
            top: '112.5px',
            left: '777.75px',
            num: 0,
            extra: 37
        },
        {
            name: '大洋洲',
            top: '338.5px',
            left: '883.5px',
            num: 0,
            extra: 5
        },
        ]
    },
    created: function() {
        this.init();
    },
    methods: {
        init: function() {
            var self = this;
            getJSON('/face_recognition/count/continent', function(result) {
                console.log('worldMap',result);
                if ( !result || !result.successful ) {
                    return;
                }

                let continents = ['北美洲', '南美洲', '非洲', '欧洲', '亚洲', '大洋洲'];
                let totalVisitors = 0;
                continents.forEach(function(continent, continentIndex) {
                    result.data.continents[continent] += self.continents[continentIndex].extra;
                    if ( continent == '亚洲' ) {
                        result.data.continents[continent] += 430;
                    }

                    self.continents[continentIndex].num = result.data.continents[continent];
                    totalVisitors += result.data.continents[continent];
                });

                $('.guests dd').text(totalVisitors);            
            });
        }
    }
});

var chinaMap = new Vue({
    el: '.china',
    data: {
        cities: [{
            value: 'hefei',
            name: '合肥',
            num: 0,
            extra: 117
        }, {
            value: 'beijing',
            name: '北京',
            num: 0,
            extra: 176
        }, {
            value: 'shanghai',
            name: '上海',
            num: 0,
            extra: 73
        }, {
            value: 'nanjing',
            name: '南京',
            num: 0,
            extra: 26
        }, {
            value: 'suzhou',
            name: '苏州',
            num: 0,
            extra: 18
        }, {
            value: 'hangzhou',
            name: '杭州',
            num: 0,
            extra: 6
        }, {
            value: 'guangzhou',
            name: '广州',
            num: 0,
            extra: 8
        }, {
            value: 'chengdu',
            name: '成都',
            num: 0,
            extra: 4
        }, {
            value: 'xian',
            name: '西安',
            num: 0,
            extra: 2
        }]
    },
    created: function() {
        this.init();
    },
    methods: {
        init: function() {
            var self = this;
            getJSON('/face_recognition/count/city', function(result) {
                console.log('chinaMap', result);
                if ( !result || !result.successful ) {
                    return;
                }

                let cities = ['合肥', '北京', '上海', '南京', '苏州', '杭州', '广州', '成都', '西安'];
                cities.forEach(function(city, cityIndex) {
                    result.data.cities[city] += self.cities[cityIndex].extra;
                    self.cities[cityIndex].num = result.data.cities[city];
                });
            });
        }
    }
});

