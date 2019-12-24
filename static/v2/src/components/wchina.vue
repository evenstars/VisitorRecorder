<template>
    <transition name="fade">
        <div class="w_china" style="width: 988px; height: 877px; position: absolute; left: 292px; top: 140px;" v-show="show">
            <div class="city gz">
                <span class="rb" @click="searchc('广州','.gz')">广州<b>{{cityGuangzhou}}</b></span>
            </div>
            <div class="city bj">
                <span class="rt" @click="searchc('北京','.bj')">北京<b>{{cityBeijing}}</b></span>
            </div>
            <div class="city sh">
                <span class="rb" @click="searchc('上海','.sh')">上海<b>{{cityShanghai}}</b></span>
            </div>
            <div class="city sz">
                <span class="rt" @click="searchc('苏州','.sz')">苏州<b>{{citySuzhou}}</b></span>
            </div>
            <div class="city hz">
                <span class="rb" @click="searchc('杭州','.hz')">杭州<b>{{cityHangzhou}}</b></span>
            </div>
            <div class="city xa">
                <span class="lt" @click="searchc('西安','.xa')">西安<b>{{cityXian}}</b></span>
            </div>
            <div class="city hf">
                <span class="lb" @click="searchc('合肥','.hf')">合肥<b>{{cityHefei}}</b></span>
            </div>
            <div class="city nj">
                <span class="rt" @click="searchc('南京','.nj')">南京<b>{{cityNanjing}}</b></span>
            </div>
            <div class="city cd">
                <span class="lt" @click="searchc('成都','.cd')">成都<b>{{cityChengdu}}</b></span>
            </div>
        </div>
    </transition>
</template>

<script type="text/javascript">
    'use strict';
    const $ = require('jquery');
    module.exports = {
        data() {
            return {
                show: false
            }
        },
        computed: {
            focus: function() {
                return this.$store.state.earth.focus;
            },
            cityHefei: function() {
                return this.$store.state.earth.cityHefei;
            },
            cityBeijing: function() {
                return this.$store.state.earth.cityBeijing;
            },
            cityNanjing: function() {
                return this.$store.state.earth.cityNanjing;
            },
            citySuzhou: function() {
                return this.$store.state.earth.citySuzhou;
            },
            cityHangzhou: function() {
                return this.$store.state.earth.cityHangzhou;
            },
            cityShanghai: function() {
                return this.$store.state.earth.cityShanghai;
            },
            cityGuangzhou: function() {
                return this.$store.state.earth.cityGuangzhou;
            },
            cityChengdu: function() {
                return this.$store.state.earth.cityChengdu;
            },
            cityXian: function() {
                return this.$store.state.earth.cityXian;
            }
        },
        watch: {
            focus: function() {
                var focus = this.focus;
                if(focus) {
                    setTimeout(() => {
                        if(this.focus) {
                            this.show = true;
                        }
                    }, 1000);
                } else {
                    this.show = false;
                }
            }
        },
        methods: {
            searchc(va,csw) {
                // if(this.select) {
                this.$store.state.earth.claAll=csw;
                $(".w_china span").css("backgroundColor","rgba(6, 57, 86, 0.6)");
                $(".w_china "+csw+" span").css("backgroundColor","rgb(74,35,86)");
                $(".w_china span").css("color","rgb(255,255,255)");
                this.$store.dispatch('gallery.fetch', {
                    area: va
                });
                // }
            }
        }
    };

</script>