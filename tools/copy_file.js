'use strict';

let utils = require('../modules/lib/utils');
let ftp = require('../config/ftp.js');

let imageName = 'c307c7c7-65ac-4fb6-a4b9-55a4c73479a3.jpg';

let picNames = [ imageName ];

utils.copyFile(`${ftp.paths.training}/${picNames[0]}`,
        `${ftp.paths.recognize}/${picNames[0]}`);