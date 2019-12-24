<template>
<div class="w_previewer" :style="{left: left+'px', top: top+'px', transform: 'scale('+scale+')', 'transform-origin': '50% '+origin+'%'}" :class="{init: scale != 1}" @click="hide">
    <a href="javascript:void(0)" class="close" >
        <b class="i_ i_close"></b>
    </a>
    <div class="title">
        <b class="i_ i_butter"></b>
        <span>{{time}}</span>
    </div>
    <div class="pic">
        <img :src="src" :style="{width: width+'px', height: height+'px'}">
    </div>
    <div class="info">
        <div class="name">
        {{name}}
        </div>
        <div class="office">
            {{university}}{{office ? '&emsp;'+office : ''}}
        </div>
    </div>
</div>
</template>

<script type="text/javascript">
'use strict';

const {mapGetters} = require('vuex');

module.exports = {
    computed: {
        left() {
            return this.$store.state.previewer.left;
        },
        top() {
            return this.$store.state.previewer.top;
        },
        name() {
            return this.$store.state.previewer.name;
        },
        university() {
            return this.$store.state.previewer.university;
        },
        office() {
            return this.$store.state.previewer.office;
        },
        time() {
            return this.$store.state.previewer.time;
        },
        src() {
            return this.$store.state.previewer.src;
        },
        scale() {
            return this.$store.state.previewer.scale;
        },
        origin() {
            return this.$store.state.previewer.origin;
        },
        width() {
            return this.$store.state.previewer.width;
        },
        height() {
            return this.$store.state.previewer.height;
        }
    },
    methods: {
        hide() {
            this.$store.commit('previewer.animationHide');
        }
    }
};
</script>