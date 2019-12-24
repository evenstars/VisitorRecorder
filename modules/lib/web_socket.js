'use strict';

const webSocket = require('ws');
const fs = require('fs');
const Fiber = require('fibers');

class WebSocket {
    constructor() {

    }

    request(opt) {
        var host = opt.host;
        var port = opt.port;
        var path = opt.path;
        var wsUrl = `ws://${host}:${port}${path}`;
        console.log(wsUrl);
        
        //视频流地址
        var rtspUrl = opt.data.url;
        //ws连接
        var postUrl = wsUrl + "?url=" + encodeURIComponent(rtspUrl);
        var result = '';
        
        var fiber = Fiber.current;
        var image;
        var time = 0;
        //初始化操作
        var intervalid;
        var ws = new webSocket(postUrl);
        ws.onopen = function(evt) {
            console.log('onopen');
            onOpen(evt, ws);
            intervalid = setInterval(function(){
                time ++;
                console.log(time);
                if (time == 20){
                    result = {
                        recognize: false,
                        image: image
                    };
                    console.log('start');
                    clearInterval(intervalid);
                    ws.close();
                    fiber.run();
                }
            },1000 * 1);

        };
        ws.onclose = function(evt) {
            console.log('onclose');
            onClose(evt);
        };
        ws.onmessage = function(evt) {
            console.log('onmessage');
            var data = JSON.parse(evt.data);
            fs.appendFileSync('./data/image.txt', JSON.stringify(JSON.parse(evt.data)));
            if(data.type == 'recognized') {
                console.log('recognized');
                ws.close();
                image = new Buffer(data.person.src.substr(22), 'base64');
                result = {
                    recognize: true,
                    person: data.data.person,
                    image: image
                };
            }
            image = data.data.face;
            if(image) {
                image = image.image;
                image = new Buffer(image, 'base64');
                fs.writeFileSync('./data/1.jpg',image);
            }
            if(data.type == 'unrecognized') {

                console.log('unrecognized');
                ws.close();
                result =  {
                    recognize: false,
                    image: image
                };
            }
            if (result != ''){
                clearInterval(intervalid);
                fiber.run();
            }
        };
        ws.onerror = function(evt) {
            console.log('onerror');
            onError(evt);
        };
        Fiber.yield();
        return result;
    }

}
 
function onOpen(evt) {
    console.log("CONNECTED");
}
 
function onClose(evt) {
    console.log("DISCONNECTED");
}
 

function onError(evt) {
    console.log(evt);
}
 
function doSend(message, ws) {
    console.log("SENT: " + message);
    ws.send(message);
}
 



module.exports = WebSocket;
