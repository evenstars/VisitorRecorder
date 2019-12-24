'use strict';

$(document).ready(function() {
    $('.container').click(function(e) {
        console.log('snap');
        postJSON('/face_recognition/call_snap', {
        }, function(result) {
            if ( result && result.successful ) {
                alert('发送拍摄指令成功');
            }
        });
        
        return false;
    });
})