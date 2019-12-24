/**
 * Created by legend on 2018/11/27.
 */
const qr = require('qr-image');
const fs = require('fs');

function makeQrCode(id, filename){
    const qrCodeHref = `http://127.0.0.1:8088/qrcode.html?people=${id}`;
    const qrImage = qr.imageSync(qrCodeHref, {
        type: 'png'
    });

    const qrCodePath = `${filename}.png`;
    fs.writeFileSync(qrCodePath, qrImage);

    return `${filename}.png`;
}

var path = makeQrCode(53,`test`);
console.log(path);