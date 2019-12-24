<template>
<div class="w_gallery">
    <gmarquee v-for="(item, key) in list" :list="item" :index="key" :class="getClass(key)" @click="setActive" :active="isActive(key)" :direction="getDireaction(key)" :step="getStep(key)" ></gmarquee>
</div>
</template>

<script type="text/javascript">
'use strict';
const Vue = require('vue/dist/vue.js');
const $ = require('jquery');

module.exports = {
    data() {
        return {
            classList: []
        }
    },
    computed: {
        list() {
            return this.$store.state.gallery.list
        }
    },
    watch: {
        list() {
            let length = this.list.length;
            let classList = [];

            for(let i = 0; i < length; i++) {
                var residue = i % 3;

                switch(residue) {
                    case 0:
                        classList.push({
                            size: 's',
                            mask: Math.random() > 0.5,
                            order: Math.random() > 0.5 ? 'up' : 'down'
                        });
                    break;

                    case 1:
                        classList.push({
                            size: 'm',
                            mask: Math.random() > 0.5,
                            order: Math.random() > 0.5 ? 'up' : 'down'
                        });
                    break;

                    case 2:
                        classList.push({
                            size: 'l',
                            mask: Math.random() > 0.5,
                            order: Math.random() > 0.5 ? 'up' : 'down'
                        });
                    break;
                }
            }

            classList = classList.sort(() => {
                return Math.random() > 0.5;
            });

            classList.pop();
            classList.push({
                size: 'xl',
                mask: false
            });

            this.classList = classList;
        }
    },
    methods: {
        getClass(key) {
            let classObj = {};

            classObj[this.classList[key].size] = true;
            classObj['mask'] = this.classList[key].mask;

            return classObj;
        },
        isActive(key) {
            return this.classList[key].size == 'xl';
        },
        findActive() {
            for(let i = 0; i < this.classList.length; i++) {
                if(this.classList[i].size == 'xl') {
                    return i;
                }
            }
        },
        setActive(index) {
            if(!this.isActive(index)) {
                this.$store.dispatch('previewer.hide');
                let activeIndex = this.findActive();

                var act = this.classList[activeIndex];
                let tmp = this.classList[index];

                Vue.set(this.classList, index, act);
                Vue.set(this.classList, activeIndex, tmp);
            }
        },
        getDireaction(key) {
            return this.classList[key].order;
        },
        getStep() {
            return Math.random() * 0.5 + 0.2;
        }
    },
    mounted() {
        this.$store.dispatch('gallery.fetch', {
            area: '北京'
        });
    }
};
</script>