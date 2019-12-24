'use strict';
 
var tempContext = null; // global variable 2d context  
var started = false;  
var mText_canvas = null;  
var x = 0, y =0;

window.add  
/*window.onload = */
var canvasShow = function() {  
    console.log("caller from");
    var canvas = document.getElementById("myCanvas");
    canvas.width = canvas.parentNode.clientWidth;  
    canvas.height = canvas.parentNode.clientHeight;  
      
    if (!canvas.getContext) {  
        console.log("Canvas not supported. Please install a HTML5 compatible browser.");  
        return;  
    }  
      
    // get 2D context of canvas and draw rectangel  
    tempContext = canvas.getContext("2d");
         
    // mouse event  
    canvas.addEventListener("mousedown", doMouseDown, false);  
    canvas.addEventListener('mousemove', doMouseMove, false);  
    canvas.addEventListener('mouseup',   doMouseUp, false);  
}  
  
function getPointOnCanvas(canvas, x, y) {  
    var bbox = canvas.getBoundingClientRect();  
    return { 
        x: x - bbox.left * (canvas.width  / bbox.width),  
        y: y - bbox.top  * (canvas.height / bbox.height)  
    };  
}  

function clearCanvas() {  
    tempContext.clearRect(0, 0, 500, 500)  
}  
  
function doMouseDown(event) {  
    var x = event.pageX;  
    var y = event.pageY;  
    var canvas = event.target;  
    var loc = getPointOnCanvas(canvas, x, y);  
    console.log("mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");  
    tempContext.beginPath();  
    tempContext.moveTo(loc.x, loc.y);  
    started = true;  
}  
  
function doMouseMove(event) {  
    var x = event.pageX;  
    var y = event.pageY;  
    var canvas = event.target;  
    var loc = getPointOnCanvas(canvas, x, y);  
    if (started) {  
        tempContext.lineTo(loc.x, loc.y);  
        tempContext.stroke();  
    }  
}  

function doMouseUp(event) {  
    console.log("mouse up now");  
    if (started) {  
        doMouseMove(event);  
        started = false;  
    }  
}  