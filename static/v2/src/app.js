'use strict';

const Vue = require('vue/dist/vue.js');
const Vuex = require('vuex');

Vue.use(Vuex);

Vue.component('app', require('./components/app.vue'));
Vue.component('scrollview', require('./components/scrollview.vue'));
Vue.component('gallery', require('./components/gallery.vue'));
Vue.component('gmarquee', require('./components/gmarquee.vue'));
Vue.component('wvideo', require('./components/wvideo.vue'));
Vue.component('wselect', require('./components/wselect.vue'));
Vue.component('wsearch', require('./components/wsearch.vue'));
Vue.component('wheader', require('./components/wheader.vue'));
Vue.component('previewer', require('./components/previewer.vue'));
Vue.component('wsearchresult', require('./components/wsearchresult.vue'));
Vue.component('wsearchdetail', require('./components/wsearchdetail.vue'));
Vue.component('visitor', require('./components/visitor.vue'));
Vue.component('earth', require('./components/earth.vue'));
Vue.component('wchina', require('./components/wchina.vue'));

let store = new Vuex.Store(require('./stores/app.js'));
let FastClick = require('./vendors/fastclick.js');

FastClick.attach(document.body);

new Vue({
    store,
    mounted() {
        var update = () => {
            // 更新时间
            this.$store.commit('updateTime');
            // 获取访客数目
            this.$store.dispatch('updateVisitor');
        };

        update();
        setInterval(() => {
            update();
        }, 1000);

        // setTimeout(() => {
        //     // 触发获取访客信息
        //     // this.$store.dispatch('visitor.fetch');
        //     this.$store.commit('earth.updateCity');
        // }, 60);
        // setInterval(() => {
        //     this.$store.commit('earth.ready', true);
        // }, 600000);
    }
}).$mount('#app');

document.oncontextmenu = function () {
    return false;
};

document.addEventListener('mousewheel', function(e) {
    if (e.deltaY % 1 !== 0 || e.ctrlKey) {
        e.preventDefault();
    }
});