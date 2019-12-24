'use strict';
const qr = require('qr-image');
const config = require('../config');
const models = require('../modules/models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const Fiber = require('fibers');
const fs = require('fs');

function main(){
    let persons = PersonDao.find({
        qrcode: '/qrcode/undefined.png'
    });
    persons.forEach(person => {
        console.log(person);
        let id = person.mid;
        const qrCodeHref = `http://${config.server.host}:${config.server.port}/qrcode.html?people=${id}`;
        const qrImage = qr.imageSync(qrCodeHref, {
            type: 'png'
        });
        const qrCodePath = `E:/megvii-recognition-1226/fascom-recognition/static/qrcode/${id}.png`;
        fs.writeFileSync(qrCodePath, qrImage);

        PersonDao.update({
            mid: person.mid
        },{
            qrcode: `/qrcode/${id}.png`
        });
    });
}

Fiber(main).run();
