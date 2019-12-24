'use strict';

const $ = require('jquery');

module.exports = {
    state: {
        active: 1,
        show: false,
        qrcode: null,
        avatar: null,
        name: null,
        university: null,
        office: null,
        times: 0,
        timeline: [],
        showPic: true,
        keyboardInputInscription:null
    },
    mutations: {
        'visitor.setInfo': function (state, result) {
            console.log("data settled");
            console.log(result);
            state.active = 0;
            state.show = true;
            state.qrcode = result.data.detectedPerson.qrcode;
            state.avatar = result.data.detectedPerson.signature;
            state.name = result.data.detectedPerson.name;
            state.university = result.data.detectedPerson.address;
            state.office = '教授';
            state.times = result.data.detectedPerson.visitTimes;
            state.timeline = result.timeline;

            //initialize the inscription given from keyboard input
            let records = result.data.detectedPerson.visitRecords;
            var inscription = "";
            // for(var i=0;i<records.length;i++){
            //     if(records[i].keyboardInputInscription){
            //         inscription = records[i].keyboardInputInscription;
            //         break;
            //     }
            // }
            state.keyboardInputInscription = inscription;
        },
        'visitor.hide': function (state) {
            state.show = false;
        },
        'visitor.setActive': function (state, key) {
            console.log(state.active);
            state.active = key;
        },
        'visitor.reset': function (state) {
            state.show = false;
            state.times = 0;
            state.avatar = null;
            state.university = null;
            state.qrcode = null;
            state.name = null;
            state.office = null;
            state.active = 1;
            state.timeline = [];
            state.showPic = true;
        }
    },
    actions: {
        'visitor.fetch': function (context, raw_websocket_data) {
            console.log(raw_websocket_data);
            var visitRecords = raw_websocket_data.data.detectedPerson.visitRecords;
            var timeline = visitRecords.map(function (t) {
                return {
                    src: t.imagePath,
                    name: raw_websocket_data.data.detectedPerson.name,
                    university: raw_websocket_data.data.detectedPerson.address,
                    office: '教授',
                    time: formatDateTime(new Date(t.Time)),
                    avatar: t.imagePath
                };
            });
            raw_websocket_data.timeline = timeline;
            context.commit('visitor.setInfo', raw_websocket_data);
        }
    }
};

function formatDateTime(date) {
    return '' + date.getFullYear() + '-' +
        paddingZero(date.getMonth() + 1, 2) + '-' +
        paddingZero(date.getDate(), 2) + ' ' +
        paddingZero(date.getHours(), 2) + ':' +
        paddingZero(date.getMinutes(), 2);
}

function paddingZero(number, width) {
    var numberString = String(number);
    if (numberString.length < width) {
        numberString = '0'.repeat(width - numberString.length) + numberString;
    }

    return numberString;
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        if (count <= 0) {
            return '';
        }

        var result = '';
        for (var i = 0; i < count; i++) {
            result += this;
        }

        return result;
    }
}

