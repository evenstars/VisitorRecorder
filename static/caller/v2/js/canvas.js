'use strict';

var started = false;
var mText_canvas = null;
var x = 0,
    y = 0;
var isDrawed = false;
var isReSignShow = false;
var isInscript1 = false;
var isInscript = false;
var isResigned = false;

// 题词
var canvasShow = function () {
    // var canvasShadow = $("#canvas-shadow")[0];
    // var canvas = $("#myCanvas")[0];
    var canvas = $("#myCanvas1")[0];
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;

    if (!canvas.getContext) {
        console.log("Canvas not supported. Please install a HTML5 compatible browser.");
        return;
    }

    // get 2D context of canvas and draw rectangel  
    var tempContext = canvas.getContext("2d");
    tempContext.fillStyle = 'black';
    tempContext.fillRect(0, 0, 1300, 250);
    tempContext.strokeStyle = "yellow";
    tempContext.strokeRect(0, 0, 1300, 250);
    
    canvas.addEventListener('touchstart', function (e) {
        doMouseDown(e, tempContext);
    });

    canvas.addEventListener('touchmove', function (e) {
        doMouseMove(e, tempContext);
    });

    canvas.addEventListener('touchend', function (e) {
        doMouseUp(e, tempContext);
    });
}

//签名
var canvasShow1 = function () {
    // 题词
    // var canvasShadow1 = $("#canvas-shadow1")[0];
    // var canvas1 = $("#myCanvas1")[0];
    // canvas1.width = canvas1.parentNode.clientWidth;
    // canvas1.height = canvas1.parentNode.clientHeight;
    //
    // if (!canvas1.getContext) {
    //     console.log("Canvas not supported. Please install a HTML5 compatible browser.");
    //     return;
    // }
    //
    // // get 2D context of canvas and draw rectangel  
    // var tempContext1 = canvas1.getContext("2d");
    // tempContext1.fillStyle = 'black';
    // tempContext1.fillRect(0, 0, 1300, 250);
    // tempContext1.strokeStyle = "yellow";
    // tempContext1.strokeRect(0, 0, 1300, 250);
    //
    // canvas1.addEventListener('touchstart', function (e) {
    //     doMouseDown(e, tempContext1);
    // });
    //
    // canvas1.addEventListener('touchmove', function (e) {
    //     doMouseMove(e, tempContext1);
    // });
    //
    // canvas1.addEventListener('touchend', function (e) {
    //     doMouseUp(e, tempContext1);
    // });

    // 签名
    // var canvasShadow2 = $("#canvas-shadow2")[0];
    var canvas2 = $("#myCanvas2")[0];
    canvas2.width = canvas2.parentNode.clientWidth;
    canvas2.height = canvas2.parentNode.clientHeight;

    // get 2D context of canvas and draw rectangel  
    var tempContext2 = canvas2.getContext("2d");
    tempContext2.fillStyle = 'black';
    tempContext2.fillRect(0, 0, 1300, 250);
    tempContext2.strokeStyle = "yellow";
    tempContext2.strokeRect(0, 0, 1300, 250);


    canvas2.addEventListener('touchstart', function (e) {
        doMouseDown(e, tempContext2);
    });

    canvas2.addEventListener('touchmove', function (e) {
        doMouseMove(e, tempContext2);
    });

    canvas2.addEventListener('touchend', function (e) {
        doMouseUp(e, tempContext2);
    });
}

// 重新签名
var canvasShow2 = function () {
    // var canvasShadow = $("#canvas-shadow")[0];
    isReSignShow = true;
    var canvas = $("#myCanvas3")[0];
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;

    if (!canvas.getContext) {
        console.log("Canvas not supported. Please install a HTML5 compatible browser.");
        return;
    }

    // get 2D context of canvas and draw rectangel  
    var tempContext = canvas.getContext("2d");
    tempContext.fillStyle = 'black';
    tempContext.fillRect(0, 0, 450, 210);
    tempContext.strokeStyle = "yellow";
    tempContext.strokeRect(0, 0, 450, 210);

    // mouse event  
    // canvas.addEventListener("mousedown", function(event) {
    //     doMouseDown(event, tempContext);
    // }, false);  
    // canvas.addEventListener('mousemove', function(event) {
    //     doMouseMove(event, tempContext);
    // }, false);  
    // canvas.addEventListener('mouseup',   function(event) {
    //     doMouseUp(event, tempContext);
    // }, false);  
    canvas.addEventListener('touchstart', function (e) {
        doMouseDown(e, tempContext);
    });

    canvas.addEventListener('touchmove', function (e) {
        doMouseMove(e, tempContext);
    });

    canvas.addEventListener('touchend', function (e) {
        doMouseUp(e, tempContext);
    });
}

function getPointOnCanvas(canvas, x, y) {
    var bbox = {
        left: canvas.offsetLeft,
        top: canvas.offsetTop,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight
    };

    return {
        x: x - bbox.left,
        y: y - bbox.top
    };
}

//clean the only inscription canvas
function clearCanvas() {
    // var canvas = $(".myCanvas")[0];
    var canvas = $(".myCanvas")[0];
    var tempContext = canvas.getContext("2d");
    tempContext.clearRect(0, 0, canvas.weight, canvas.height);
}

function doMouseDown(event, tempContext) {
    var touches = event.touches;
    var touchPoint = touches[0];

    var x = touchPoint.pageX;
    var y = touchPoint.pageY;

    // var x = event.pageX;  
    // var y = event.pageY;  
    var canvas = event.target;

    var loc = getPointOnCanvas(canvas.parentNode, x, y);
    // console.log("mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");
    tempContext.beginPath();
    tempContext.moveTo(loc.x, loc.y);
    started = true;

    event.stopPropagation();
    event.preventDefault();
}

function doMouseMove(event, tempContext) {
    var touches = event.touches;
    if (touches.length) {
        var touchPoint = touches[0];

        var x = touchPoint.pageX;
        var y = touchPoint.pageY;

        // var x = event.pageX;  
        // var y = event.pageY;  
        var canvas = event.target;
        var loc = getPointOnCanvas(canvas.parentNode, x, y);
        if (started) {
            tempContext.lineTo(loc.x, loc.y);
            tempContext.strokeStyle = "#fff";
            tempContext.stroke();
            if (event.target.id == "myCanvas2") {
                isDrawed = true;
            } else if (event.target.id == "myCanvas1") {
                isInscript1 = true;
            } else if (event.target.id == "myCanvas") {
                isInscript = true;
            } else if (event.target.id == "myCanvas3"){
                isResigned = true;
            }
        }

        event.stopPropagation();
        event.preventDefault();
    }
}

function doMouseUp(event, tempContext) {
    if (started) {
        doMouseMove(event, tempContext);
        started = false;
    }

    event.stopPropagation();
    event.preventDefault();
}