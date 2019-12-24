'use strict';

$(document).ready(function(e) {
    $('.btn-go-train').click(function(e) {
        window.location = 'index.html';
        return false;
    });

    $('.btn-go-recognize').click(function(e) {
        window.location = 'index_recognize.html';
        return false;
    });
});
