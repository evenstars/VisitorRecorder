'use strict';

const fs = require('fs');
const qr = require('qr-image');
const config = require('../config');
const savepath = config.savepath; 

function makeQrCode(id){
    const qrCodeHref = `http://${config.server.host}:${config.server.port}/qrcode.html?people=${id}`;
    console.log(`Link: ${qrCodeHref}`);
    const qrImage = qr.imageSync(qrCodeHref, {
        type: 'png'
    });

    const qrCodePath = `${savepath.localPath}/${savepath.staticPaths.qrcode}/${id}.png`;
    fs.writeFileSync(qrCodePath, qrImage);
}

const PeopleIds = [
    53, 54, 55, 56, 57, 58, 59, 60
];

PeopleIds.forEach(peopleId => {
    console.log(`Make qrcode ${peopleId}`);
    makeQrCode(peopleId);
});
