<template>
<div class="header_bar">
    <div class="date">
        <div class="title">
            <b class="i_ i_calendar"></b><span>日期</span>
        </div>
        <div class="detail">
            <div class="day font-hke">
                {{time.day}}
            </div>
            <div class="">
                <div class="year font-hke">
                    {{time.year}}
                </div>
                <div class="month">
                    <span class="font-hke">{{time.month}}</span><span class="unit">月</span>
                </div>
            </div>
        </div>
    </div>

    <div class="time">
        <div class="title">
            <b class="i_ i_clock"></b><span>时间</span>
        </div>
        <div class="detail">
            <div class="minute font-hke">
                {{time.hour}} : {{time.minute}}
                <div class="second font-hke">
                    {{time.second}}
                </div>
            </div>
        </div>
    </div>

    <div class="visitor">
        <div class="num_TH_welcomeLabel font-hke">
            欢迎参观清华大学合肥公共安全研究院
        </div>
        <div class="title">
            迄今到访人员
        </div>
        <div class="num font-hke">
            {{visitorNum}}
        </div>
        <!--
        <div class="until_year">
            {{time.year}}年到访人数  <span>{{visitorYear}}</span>
        </div>
        -->
    </div>
</div>
</template>

<script type="text/javascript">
'use strict';    

module.exports = {
    computed: {
        time() {
            return this.$store.state.time;
        },
        visitorNum() {
            return this.$store.state.visitorNum;
        },
        visitorYear() {
            return this.$store.state.visitorYear;
        }
    }
};
</script>