<template>
<div class="list" @click="click" @transitionend="transitionend" ref="wrapper" @mousedown="mousedown" @touchstart="mousedown" @mousewheel="mousewheel">
    <div  class="scroll" :style="{top: transformStyle, transition: transition}" >
        <ul>
            <li v-for="item in list">
                <img :src="item.src" @load="imgLoad" @click="preview(item, $event)">
            </li>
            <li v-for="item in fillList">
            <img :src="item.src" @load="imgLoad" @click="preview(item, $event)">
        </li>
        </ul>

        <ul ref="list">
            <li v-for="item in list">
                <img :src="item.src" @load="imgLoad" @click="preview(item, $event)">
            </li>
            <li v-for="item in fillList">
                <img :src="item.src" @load="imgLoad" @click="preview(item, $event)">
            </li>
        </ul>

        <ul>
            <li v-for="item in list">
                <img :src="item.src" @load="imgLoad" @click="preview(item, $event)">
            </li>
            <li v-for="item in fillList">
                <img :src="item.src" @load="imgLoad" @click="preview(item, $event)">
            </li>
        </ul>

    </div>
</div>
</template>

<script type="text/javascript">
const $ = require('jquery');
const _ = require('lodash');

module.exports = {
    props: {
        index: {
            type: Number
        },
        list: {
            type: Array,
            default: []
        },
        active: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: 'up'
        },
        step: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            loaded: 0,
            fillList: [],
            listHeight: 0,
            uid: _.uniqueId(),
            touchStartY: 0,
            touchMoveY: 0,
            transformY: 0,
            transition: '',
            clickY: 0,
            size: ''
        }
    },
    computed: {
        mouseDiff() {
            var diff = this.touchMoveY - this.touchStartY;

            return diff;
        },
        transformStyle() {
            var transformY = this.transformY + this.mouseDiff;

            return `${transformY}px`;
        }
    },
    watch: {
        active() {
            this.pause();
            this.transition = 'all linear 400ms';

            let sizeMap = {
                's': 244/74,
                'm': 244/94,
                'l': 244/114
            };
            let ty = this.transformY + (this.list.length + this.fillList.length) * 2;

            if(this.active) {
                let radio = sizeMap[this.size];

                ty *= radio;
                ty -= this.clickY * (radio -1);
            } else {
                this.rememberSize();
                let radio = sizeMap[this.size];

                ty /= radio;
            }

            ty -= (this.list.length + this.fillList.length) * 2;

            this.transformY = ty;
        },
        list:{
            handler:function(val,oldval){
                //console.log(val)
                this.fixListtemp();
            },
            deep:true//对象内部的属性监听，也叫深度监听
        }
    },
    methods: {
        // 判断图片是否全部加载
        imgLoad() {
            this.loaded++;

            if(this.loaded >= (this.list.length + this.fillList.length)) {
                this.fixList();

                this.transformY = -this.listHeight * 1.5;
                this.rememberSize();
            }
        },
        // 动画完成
        transitionend() {

            this.fixList();
            this.checkPlay();
            setTimeout(() => {
                this.transition = '';
            }, 50);
        },
        // 列表填充全屏
        fixList() {

            if(this.$refs.list.offsetHeight < this.$refs.wrapper.offsetHeight) {
                 this.fillList = this.fillList.concat(this.list);
            } else {
                this.listHeight = this.$refs.list.offsetHeight;
            }
        },
        fixListtemp() {
            //console.log('1111');添加事件  给出的有图刷新
            this.fillList =this.list;
        },
        // 抛出click事件
        click(e) {
            if(!this.active) {
                this.clickY = e.pageY;
                this.$emit('click', this.index);
            }
        },
        // 检测边界溢出 
        checkOverflow() {
            if(Math.abs(this.transformY) < this.listHeight) {
                this.transformY -= this.listHeight;
            } else if(Math.abs(this.transformY) > this.listHeight * 2) {
                this.transformY += this.listHeight;
            }
        },
        // 开始拖动
        mousedown(event) {
            if(!this.active) {
                return;
            }
            if(this.transition !== '') {
                return;
            }

            var pageY = event.pageY || event.touches[0].pageY;
            // 重置终点，使位移为0
            this.touchStartY = pageY;
            this.touchMoveY = pageY;

            $('body').on(`mousemove.gmarquee${this.uid}`, (event) => {
                var pageY = event.pageY;

                this.touchMoveY = pageY;
                this.$store.dispatch('previewer.hide');
                return false;
            });

            $('body').on(`touchmove.gmarquee${this.uid}`, (event) => {
                var pageY = event.changedTouches[0].pageY;

                this.touchMoveY = pageY;
                this.$store.dispatch('previewer.hide');
                return false;
            });

            $('body').on(`mouseup.gmarquee${this.uid}`, (event) => {
                var pageY = event.pageY;

                this.touchMoveY = pageY;
                this.mouseFinal();

                $('body').off(`mousemove.gmarquee${this.uid}`);
                $('body').off(`mouseup.gmarquee${this.uid}`);
                return false;
            });

            $('body').on(`touchend.gmarquee${this.uid}`, (event) => {
                var pageY = event.changedTouches[0].pageY;

                this.touchMoveY = pageY;
                this.mouseFinal();

                $('body').off(`touchmove.gmarquee${this.uid}`);
                $('body').off(`touchend.gmarquee${this.uid}`);
                return false;
            });
        },
        mousewheel({deltaY}) {
            if(!this.active) {
                return;
            }
            if(this.transition !== '') {
                return;
            }

            this.transformY -= deltaY;
            this.checkOverflow();
        },
        // 拖动结束，固定位置
        mouseFinal() {
            let transformY = this.transformY + this.mouseDiff;
            this.touchMoveY = 0;
            this.touchStartY = 0;

            this.transformY = transformY;
            this.checkOverflow();
        },
        // 检测是否需要自动轮播
        checkPlay() {
            if(this.active) {
                this.pause();
            } else {
                this.play();
            }
        },
        // 开始自动轮播
        play() {
            if(this.direction == 'down') { // down
                this.transformY += this.step;
            } else { // up
                this.transformY -= this.step;
            }

            this.checkOverflow();
            // cancelAnimationFrame(this.raf);
            clearTimeout(this.raf);
            // this.raf = requestAnimationFrame(() => {
            this.raf = setTimeout(() => {
                this.play();
            }, 20);
        },
        // 暂停自动轮播
        pause() {
            clearTimeout(this.raf);
        },
        // 记住当前的尺寸,用来做缩放用
        rememberSize() {
            this.size = this.$refs.wrapper.classList[1];
        },
        // 展示预览
        preview(item, event) {
            if(this.transition !== '') {
                return;
            }
            if(this.active) {
                var el = event.currentTarget;

                $(el).offset();

                var info = Object.create(item);
                info.offset = $(el).offset();
                info.offset.width = $(el).width();
                info.offset.height = $(el).height();

                this.$store.dispatch('previewer.show', info);
            }
        }
    },
    mounted() {
        this.fixList();
        this.checkPlay();
    }
};
</script>