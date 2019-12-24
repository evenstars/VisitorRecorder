<template>
<div class="w_video">
    <div class="video">
        <video ref="player" id="video" class="vjs-tech" preload="auto" :src="src" loop></video>
    </div>
    <div class="name">
        {{name}}
    </div>
</div>
</template>

<script type="text/javascript">
module.exports = {
    computed: {
        name: function() {
            return this.$store.state.video.name;
        },
        src: function() {
            return this.$store.state.video.src;
        }
    },
    mounted() {
        this.$refs.player.currentTime = 0;
        this.$refs.player.play();
    },
    beforeDestroy() {
        this.$refs.player.pause();
    }
};
</script>