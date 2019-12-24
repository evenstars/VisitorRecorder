'use strict';
const Fiber = require('fibers');
const recognize = require('../modules/services/recognize');

function main(){
    recognize.makeQrCode(17, '1.jpg');

}

Fiber(main).run();