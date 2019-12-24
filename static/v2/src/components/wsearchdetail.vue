<template>
<div class="w_search_detail">
    <div class="info">
        <div class="avatar">
            <img :src="data.src">
        </div>
        <div class="user">
            <div class="name">
                {{data.name}}
            </div>
            <div class="office">
                {{data.university}}{{data.office ? '&emsp;' + data.office : ''}}
            </div>
        </div>
        <div class="qrcode">
            <img :src="data.qrcode">
        </div>
    </div>
    <div class="timeline">
        <scrollview class="wrapper" tag="div">
            <ul>
                <li v-for="item in data.timeline">
                    <div class="preview" >
                        <img :src="item.src" @click="preview(item, $event)">
                    </div>

                    <div class="time">
                        {{item.time}}
                    </div>
                </li>
            </ul>
        </scrollview>
    </div>
    <a href="javascript:void(0)" class="back" @click="back">
        <b class="i_ i_back"></b> 返回
    </a>
</div>
</template>

<script type="text/javascript">
'use strict';

const $ = require('jquery');

module.exports = {
    computed: {
        data() {
            return this.$store.state.search.detail;
        }
    },
    methods: {
        back() {
            this.$store.commit('search.returnFromDetail');
        },
        preview(item, event) {
            var el = window.event.target;

            $(el).offset();

            var info = Object.create(item);
            info.offset = $(el).offset();
            info.offset.width = $(el).width();
            info.offset.height = $(el).height();

            this.$store.dispatch('previewer.show', info);
        },
        close() {
            this.$store.commit('search.hideDetail');
        }
    }
};
</script>
