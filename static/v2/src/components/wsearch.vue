<template>
<div class="w_search">
    <transition name="fade">
        <div class="form" v-if="!loading">
            <wselect :options="options" v-model="select"></wselect>
            <a href="javascript:void(0)" class="submit" @click="search">确定</a>
        </div>
    </transition>

    <transition name="fade">
        <div class="w_loading" v-if="loading"></div>
    </transition>
</div>
</template>

<script type="text/javascript">
'use strict';

module.exports = {
    data() {
        return {
            select: null
        }
    },
    computed: {
        options() {
            return this.$store.state.search.options;
        },
        loading() {
            return this.$store.state.search.requesting;
        }
    },
    methods: {
        search() {
            // if(this.select) {
                this.$store.dispatch('search.search', {
                    area: this.select
                });
            // }
        }
    },
    mounted() {
        this.$store.commit('search.setRequestStatus', false);
    }
};
</script>