<template>
<div id="chart" class="w_earth"></div>
</template>

<script type="text/javascript">
'use strict';

const $ = require('jquery');

module.exports = {
    data() {
        return {
            chart: null
        };
    },
    computed: {
        ready() {
            return this.$store.state.earth.ready;
        },
        focus() {
            return this.$store.state.earth.focus;
        },
    },
    watch: {
        focus(isFocus) {
            if(isFocus) {
                this.focus2China();
            } else {
                this.unfocus2China();
            }
        },
        ready(isready) {
            console.log(isready);
            if (isready) {
                this.init();
            }
        }
    },
    mounted() {
        this.chart = echarts.init(this.$el);
        this.init();
    },
    methods: {
        init() {
            var self = this;
            $.ajax({
                url: '/home/count/city',
                type: 'get',
                contentType: 'application/json',
                data: '',
                dataType: 'json',
                success: function (result) {
                    if (result.successful) {
                        var cities = result.data.cities;
                        var cityHefei = cities[2];
                        var cityBeijing = cities[0];
                        var cityNanjing = cities[1];
                        var citySuzhou = cities[8];
                        var cityHangzhou = cities[5];
                        var cityShanghai = cities[3];
                        var cityGuangzhou = cities[4];
                        var cityChengdu = cities[7];
                        var cityXian = cities[6];
                        var data = require('../config/data.js');
                        var max = -Infinity;


                        data = data.map(function (item) {
                            max = Math.max(item[2], max);
                            if(item[2] > 5000) {
                                item[2] = item[2] * 0.6;
                            }
                            // 合肥
                            if(item[0] == 117 && item[1] == 32) {
                                console.log('合肥',self.$store.state.earth.cityHefei);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityHefei
                                }
                            }
                            // 北京
                            if(item[0] == 116 && item[1] == 40) {
                                console.log('北京',self.$store.state.earth.cityBeijing);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityBeijing
                                }
                            }
                            //南京
                            if(item[0] == 120 && item[1] == 32) {
                                console.log('南京',self.$store.state.earth.cityNanjing);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityNanjing
                                }
                            }
                            // 苏州
                            if(item[0] == 120.5 && item[1] == 31) {
                                console.log('苏州',self.$store.state.earth.citySuzhou);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: citySuzhou
                                }
                            }
                            // 杭州
                            if(item[0] == 120 && item[1] == 30) {
                                console.log('杭州',self.$store.state.earth.cityHangzhou);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityHangzhou
                                }
                            }
                            // 上海
                            if(item[0] == 121.5 && item[1] == 31) {
                                console.log('上海',self.$store.state.earth.cityShanghai);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityShanghai
                                }
                            }
                            // 广州
                            if(item[0] == 113.5 && item[1] == 23) {
                                console.log('广州',self.$store.state.earth.cityGuangzhou);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityGuangzhou
                                }
                            }
                            // 成都
                            if(item[0] == 104 && item[1] == 30.5) {
                                console.log('成都',self.$store.state.earth.cityChengdu);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityChengdu
                                }
                            }
                            // 西安
                            if(item[0] == 109 && item[1] == 34) {
                                console.log('西安',self.$store.state.earth.cityXian);
                                return {
                                    geoCoord: item.slice(0, 2),
                                    value: cityXian
                                }
                            }
                            return {
                                geoCoord: item.slice(0, 2),
                                value: item[2]
                            }
                        });

                        function process_height(data){
                            var decent_max_height = 15,
                                decent_range = 0.7,
                                a=1,
                                b=1;

                            if(data.length && data.length>0){
                                var max_num = data[0];
                                var min_num = data[0];
                                for(var i =0;i<=data.length;i++){
                                    if(data[i]> max_num){
                                        max_num = data[i];
                                    }else if(data[i]<min_num){
                                        min_num = data[i];
                                    }
                                }
                                b = Math.pow(Math.pow(max_num +1,0.3)/(min_num+1),(10/7));
                                a = decent_max_height/Math.log(b*(max_num+1));
                            }

                            function compute_height(x){
                                if(isNaN(x)){
                                    return 0;
                                }
                                return a*Math.log(b*(x+1));
                            }

                            return compute_height;
                        }


                        var nums_data = data.map(function(x){
                            return x.value;
                        });

                        var compute_height = process_height(nums_data);

                        data.forEach(function (item) {
                            var value = item.value;
                            if(value===0){
                                item.barHeight = 0.1;
                            }else{
                                item.barHeight = compute_height(value);
                            }

                        });
                    
                        self.chart.setOption({
                            title : {
                                text: '',
                                subtext: '',
                                sublink : '',
                                x: 'center',
                                y: 'top',
                                textStyle: {
                                    color: 'white'
                                },
                                show: false
                            },
                            tooltip: {
                                formatter: '{b}',
                                show: false
                            },
                            toolbox: {
                                show: false
                            },
                            axis: {
                                show: false
                            },
                            dataRange: {
                                min: 0,
                                max: max,
                                text:['High','Low'],
                                realtime: false,
                                calculable : false,
                                color: ['purple','yellow','lightskyblue'],
                                show: false
                            },
                            series: [{
                                type: 'map3d',
                                mapType: 'world',
                                baseLayer: {
                                    // backgroundColor: 'rgba(0, 0, 0, 0)',
                                    backgroundColor: 'rgba(0, 150, 200, 0.5)',
                                    // backgroundColor: 'rgba(141, 251, 255, 0.3)',
                                    quality: 'high'
                                },
                                data: [{}],
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            color: 'rgba(0, 150, 200, 0.8)'
                                        },
                                        borderColor: '#777'
                                    }
                                },
                                markBar: {
                                    barSize: 0.6,
                                    data: data,
                                    distance: -1
                                },
                                flat: false,
                                roam: {
                                    zoom: 1.1,
                                    minZoom: 1.1,
                                    maxZoom: 1.1,
                                    autoRotateAfterStill: 5
                                },
                                clickable: false,
                                hoverable: false,
                                distance: 10
                            }]
                        });
                    
                        self.chart.dom.addEventListener('mousedown', (e) => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('click', () => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('mousewheel', (e) => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('drag', () => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('dragstart', () => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('dragend', () => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('touchstart', (e) => {
                            self.$store.commit('earth.focus', false);
                        });
                    
                        self.chart.dom.addEventListener('touchstart', (e) => {
                            var touch = e.changedTouches[0];
                            var evt = document.createEvent( 'MouseEvents', touch);  
                            evt.initMouseEvent('mousedown', true, true, e.view, e.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
                        
                            self.chart.dom.dispatchEvent(evt);
                        
                            e.stopPropagation();
                            e.preventDefault();
                        });
                    
                        self.chart.dom.addEventListener('touchmove', (e) => {
                            var touch = e.changedTouches[0];
                            var evt = document.createEvent( 'MouseEvents' );  
                            evt.initMouseEvent('mousemove', true, true, e.view, e.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
                        
                            self.chart.dom.dispatchEvent(evt);
                        
                            e.stopPropagation();
                            e.preventDefault();
                            self.unfocus2China();
                        });
                    
                        self.chart.dom.addEventListener('touchend', (e) => {
                           
                            var touch = e.changedTouches[0];
                            var evt = document.createEvent( 'MouseEvents' );  
                            evt.initMouseEvent('mouseup', true, true, e.view, e.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
                        
                            self.chart.dom.dispatchEvent(evt);
                        
                            e.stopPropagation();
                            e.preventDefault();
                           
                        });
                    
                        self.chart.on(echarts.config.EVENT.CLICK, (event) => {
                            
                            if(event.name == 'China') {
                                self.$store.commit('earth.focus', true);
                            }
                        });
                        setTimeout(() => {
                            self.hlChina();
                        }, 100);
                        
                    }
                }
            });
            this.$store.dispatch('earth.fetch');
        },
        focus2China() {
            var sharp = this.chart.chart.map3d._globeSurface.getShapeByName('China');
            this.chart.chart.map3d._mapRootNode.__control.stopAllAnimation();

            var rect = sharp.getRect(sharp.style);
            console.log(rect.y)
            // rect.x = 100;
                rect.y = 832+100;

                this.plus = true;


            this.chart.chart.map3d._focusOnShape(sharp);
            this.chart.chart.map3d._mapRootNode.__control._rotating = false;
            clearTimeout(this.chart.chart.map3d._mapRootNode.__control._stillTimeout);
        },
        unfocus2China() {
            setTimeout(() => {
                clearTimeout(this.chart.chart.map3d._mapRootNode.__control._stillTimeout);
                this.chart.chart.map3d._mapRootNode.__control._rotating = true;
            }, 1);
        },
        hlChina() {
          //  var sharp = this.chart.chart.map3d._globeSurface.hover(3268.2914562183537, 1233.553678747434);

          //  this.chart.chart.map3d._selectShape(sharp);
        }
    }
};
</script>
