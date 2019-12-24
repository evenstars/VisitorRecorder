<template>
<div class="w_select" :class="{open: drop}">
    <div class="field" @click="toggle">
        <div class="flag">A</div><div class="value">{{select}}</div>
    </div>
    <scrollview class="dropmenu">
        <li v-for="(item, key) in options" @click="choose(item)" v-show="item.key != select">{{item.key}}</li>
    </scrollview>
</div>
</template>

<script type="text/javascript">
'use strict';

const $ = require('jquery');

module.exports = {
    props: {
        options: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            select: '请选择..',
            drop: false,
            uid: _.uniqueId()
        }
    },
    watch: {
        drop() {
            if(this.drop) {
                $('body').on('click.wselect${this.uid}', (e) => {
                    if(!$(e.target).closest('.w_select').length) {
                        this.drop = false;
                    }
                });
            } else {
                $('body').off('click.wselect${this.uid}');
            }
        }
    },
    methods: {
        toggle() {
            this.drop = !this.drop;
        },
        choose(item) {
            this.drop = false;

            this.select = item.key;
            this.$emit('input', item.value);
        }
    },
    mounted() {
        this.choose(this.options[0]);
    }
};
</script>