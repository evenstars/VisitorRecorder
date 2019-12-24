<template>
<div class="w_search_result">
    <div class="title">
        搜索结果
    </div>

    <div class="result">
        <scrollview>
            <li v-for="item in list" @click="detail(item)">
                <div class="avatar">
                    <img :src="item.src">
                </div>
                <div class="info">
                    <div class="name">
                        {{item.name}}
                    </div>
                    <div class="office">
                        {{item.university}}{{item.office ? '&emsp;'+item.office: ''}}
                    </div>
                </div>
            </li>
        </scrollview>
    </div>

    <a href="javascript:void(0)" class="back" @click="back">
        <b class="i_ i_back"></b> 返回
    </a>
</div>
</template>

<script type="text/javascript">
'use strict';

module.exports = {
    computed: {
        list() {
            return this.$store.state.search.result;
        }
    },
    methods: {
        detail(item) {
            this.$store.dispatch('search.setDetail', item);
        },
        back() {
            this.$store.commit('search.show');
        }
    }
};
</script>