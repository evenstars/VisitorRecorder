
<script type="text/javascript">
'use strict';
const _ = require('lodash');
const $ = require('jquery');

module.exports = {
    props: {
        tag: {
            type: String,
            default: 'ul'
        }
    },
    data() {
        return {
            transformY: 0,
            touchStartY: 0,
            touchMoveY: 0,
            uid: _.uniqueId()
        }
    },
    computed: {
        mouseDiff() {
            var diff = this.touchMoveY - this.touchStartY;

            return diff;
        },
    },
    methods: {
        mousedown(event) {
            var pageY = event.pageY || event.touches[0].pageY;

            // 重置终点，使位移为0
            this.touchStartY = pageY;
            this.touchMoveY = pageY;

            $('body').on(`mousemove.scrollview${this.uid}`, ({pageY}) => {
                this.touchMoveY = pageY;
                this.scroll();
                return false;
            });
            $('body').on(`touchmove.scrollview${this.uid}`, (event) => {
                var pageY = event.changedTouches[0].pageY;

                this.touchMoveY = pageY;
                this.scroll();
                return false;
            });

            $('body').on(`mouseup.scrollview${this.uid}`, ({pageY}) => {
                this.touchMoveY = pageY;
                this.scroll();

                this.touchFinal();
                $('body').off(`mousemove.scrollview${this.uid}`);
                $('body').off(`mouseup.scrollview${this.uid}`);
                return false;
            });

            $('body').on(`touchend.scrollview${this.uid}`, (event) => {
                var pageY = event.changedTouches[0].pageY;

                this.touchMoveY = pageY;
                this.scroll();

                this.touchFinal();
                $('body').off(`touchmove.scrollview${this.uid}`);
                $('body').off(`touchend.scrollview${this.uid}`);
                return false;
            });
        },
        touchFinal() {
            this.transformY = (this.$refs.root || this.$el).scrollTop;
        },
        mousewheel({deltaY}) {
            this.transformY -= deltaY;
        },
        scroll() {
            let diff = this.mouseDiff;

            (this.$refs.root || this.$el).scrollTop = this.transformY - diff;
        }
    },
    mounted() {
        this.mouseDiff;
    },
    render(createElement) {
        return createElement(
            this.tag,
            {
                on: {
                    mousedown: this.mousedown,
                    touchstart: this.mousedown,
                    mousewheel: this.mousewheel
                },
                ref: 'root'
            },
            this.$slots.default // 子组件中的阵列
        )
    }
};
</script>