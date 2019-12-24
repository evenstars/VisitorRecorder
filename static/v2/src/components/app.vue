<template>
<div>
    <wheader></wheader>

    <ul class="navigation_bar">
        <li :class="{active: video}" @click.stop="showVideo">
            <b class="i_ i_home_arrow"></b>
            <b class="i_ i_home_arrow_hover"></b>
        </li>

        <li @click.stop="earthFocus" class="home">
            <b class="i_ i_home_earth"></b>
            <b class="i_ i_home_earth_hover"></b>
        </li>

        <li :class="{active: inSearch}" @click.stop="showSearch">
            <b class="i_ i_home_search"></b>
            <b class="i_ i_home_search_hover"></b>
        </li>
    </ul>

    <transition name="fade">
        <earth style="width: 988px; height: 877px; position: absolute; left: 292px; top: 190px;"></earth>
    </transition>

    <wchina></wchina>

    <transition name="fade">
        <wvideo v-if="video"></wvideo>
    </transition>

    <transition name="fade">
        <wsearch v-if="search"></wsearch>
    </transition>

    <transition name="fade">
        <wsearchresult v-if="showResult"></wsearchresult>
    </transition>

    <transition name="fade">
        <wsearchdetail v-if="showDetail"></wsearchdetail>
    </transition>

    <gallery></gallery>

    <previewer v-show="previewShow"></previewer>

    <visitor></visitor>
</div>
</template>

<script type="text/javascript">
'use strict';
const $ = require('jquery');
module.exports = {
    data() {
        return {
            earth: './static/images/earth.png'
        }
    },
    computed: {
        video: function() {
            return this.$store.state.video.show;
        },
        search: function() {
            return this.$store.state.search.show;
        },
        previewShow: function() {
            return this.$store.state.previewer.show;
        },
        showResult: function() {
            return this.$store.state.search.showResult;
        },
        showDetail: function() {
            return this.$store.state.search.showDetail;
        },
        inSearch: function() {
            return this.search || this.showResult || this.showDetail;
        }
    },
    methods: {
        showVideo() {
            this.$store.dispatch('search.toggle', false);
            this.$store.dispatch('video.toggle', !this.video);
            this.$store.commit('earth.focus', false);
            this.$store.state.earth.focuss=false;
            this.$store.dispatch('previewer.hide');
        },
        showSearch() {
            this.$store.dispatch('video.toggle', false);
            this.$store.dispatch('search.toggle', !this.search);
            this.$store.commit('earth.focus', false);
            this.$store.state.earth.focuss=false;
            this.$store.dispatch('previewer.hide');
        },
        earthFocus() {
            if(this.$store.state.earth.focuss==false){
                this.$store.commit('earth.focus', true);
                this.$store.state.earth.focuss=true;
                $(".w_china span").css("backgroundColor","rgba(6, 57, 86, 0.6)");
                $(".w_china "+this.$store.state.earth.claAll+" span").css("backgroundColor","rgb(74,35,86)");
                $(".w_china span").css("color","rgb(255,255,255)");
            }else{
                this.$store.commit('earth.focus', false);
                this.$store.state.earth.focuss=false;
            }
            this.$store.dispatch('search.toggle', false);
            this.$store.dispatch('video.toggle', false);
            //this.$store.commit('earth.focus', true);
            this.$store.dispatch('previewer.hide');
        }
    }
};
</script>
