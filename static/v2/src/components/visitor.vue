<template>
    <transition name="fade">
        <div class="p_visitor" v-if="show" @click="close">
            <div class="display" @click.stop>
                <transition name="fade">
                    <div class="pic" v-show="showPicOne" :style="{height: picOneHeight+'px', width: picOneWidth+'px', marginTop: -picOneHeight/2+'px', marginLeft: -picOneWidth/2+'px'}">
                        <img :src="picOne">
                    </div>
                </transition>
                <transition name="fade">
                    <div class="pic second" v-show="showPicTwo" :style="{height: picTwoHeight+'px', width: picTwoWidth+'px', marginTop: -picTwoHeight/2+'px', marginLeft: -picTwoWidth/2+'px'}">
                        <img :src="picTwo">
                    </div>
                </transition>
            </div>

            <div class="mark" @click.stop>
                <div class="welcome">
                    欢迎您第 <span>{{data.times}}</span> 次到访
                </div>
                <div class="avatar">
                    <img :src="data.avatar">
                    <div class="info">
                        <div class="name">
                            {{data.name}}
                        </div>
                    </div>
                </div>

                <scrollview tag="div" class="timeline">
                    <ul>
                        <li v-for="(item, key) in data.timeline" :class="getClass(key)">
                            <div class="preview" @click.prevent.stop="setActive(key)" >
                                <img :src="item.src">
                            </div>

                            <div class="time">
                                {{item.time}}
                            </div>
                        </li>
                    </ul>
                </scrollview>
            </div>

            <div style="margin-top:-10%" class="other" @click.stop>
                <p style="
                                    color: white;
                                    font-size: 50px;
                                    font-family: Times New Roman;
                                    width:60%;
                                    margin-bottom:35%"
                                    id="keyboardInputDisplayArea"></p>

                <img :src="data.qrcode">
                <!-- <a href="javascript:void(0)" class="back" @click="close">BACK</a> -->
                <p style="
                    color: white;
                    font-size: 30px;
                    font-family: Times New Roman;width:60%;color:white" id="keyboardInputDisplayArea">扫描二维码，查看历史照片</p>
            </div>
        </div>
    </transition>
</template>
<script type="text/javascript">
    'use strict';

    module.exports = {
        data() {
            return {
                picOne: '',
                picTwo: '',
                picOneWidth: 0,
                picOneHeight: 0,
                picTwoWidth: 0,
                picTwoHeight: 0,
                showPicOne: true,
                showPicTwo: false
            };
        },
        computed: {
            data() {
                this.$store.state.earth.focuss=false;
                this.$store.commit('earth.focus', false);
                return this.$store.state.visitor;
            },
            show() {
                return this.$store.state.visitor.show;
            },
            activeItem() {
                return this.$store.state.visitor.timeline[this.$store.state.visitor.active];
            },
            showPic() {
                return this.$store.state.visitor.showPic;
            }
        },
        watch: {
            activeItem({src}) {
                this.calcPicSize(src, (info) => {
                    if(this.showPicOne) {
                        this.showPicOne = false;
                        this.showPicTwo = true;
                        this.picTwoHeight = info.height;
                        this.picTwoWidth = info.width;
                        this.picTwo = src;
                    } else {
                        this.showPicTwo = false;
                        this.showPicOne = true;
                        this.picOneHeight = info.height;
                        this.picOneWidth = info.width;
                        this.picOne = src;
                    }
                });
            }
        },
        methods: {
            calcPicSize(src, callback) {
                var img = new Image();

                img.src = src;
                img.onload = function() {
                    var height = img.height;
                    var width = img.width;
                    var xWidth = 800;
                    var xHeight = 600;

                    if(width > xWidth) {
                        height = (xWidth / width) * height;
                        width = xWidth;
                    }

                    if(height > xHeight) {
                        width = (xHeight / height) * width;
                        height = xHeight;
                    }

                    callback({
                        height: height,
                        width: width
                    });
                };
            },
            close() {
                this.$store.commit('visitor.hide');
            },
            setActive(key) {

                this.$store.commit('visitor.setActive', key);
            },
            getClass(key) {
                if(key == this.$store.state.visitor.active) {
                    return {'active': true};
                }
            }
        }
    };
</script>

