'use strict';

const config = require('../../config');
const uuid = require('uuid');
const errors = config.errors;
const megvii = config.megvii;
const savepath = config.savepath; 
const fs = require('fs');
const loggers = require('../lib/loggers');
const outputLogger = loggers.output;
const path = require('path');
const utils = require('../lib/utils');
const copyFile = utils.copyFile;
const models = require('../models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;
const Megvii = require('../lib/megvii');
const Foscam = require('../lib/foscam');
const request = require('request');
const cheerio = require('cheerio');
const qr = require('qr-image');

// function snapAndSavePicture(picName) {
//     const savePath = path.join(savepath.paths.recognize, picName);
//     const foscam = new Foscam();
//     foscam.saveSnapPitcure(savePath);
// }

function makeQrCode(id, filename){
    const qrCodeHref = `http://${config.server.host}:${config.server.port}/qrcode.html?people=${id}`;
    const qrImage = qr.imageSync(qrCodeHref, {
        type: 'png'
    });

    const qrCodePath = `${savepath.localPath}/${savepath.staticPaths.qrcode}/${filename}.png`;
    fs.writeFileSync(qrCodePath, qrImage);

    return `${savepath.staticPaths.qrcode}/${filename}.png`;
}

function getTimeLine(id){
    let person = PersonDao.findOne({
        mid: id
    });
    if(!person) {
        outputLogger.error(errors.dbQueryError);
        throw(errors.dbQueryError);
        
        return;
    }
    let visitRecords = VisitRecordDao.find({
        Person: person.Id
    });
    person.visitTimes = VisitRecordDao.count({
        isInscription: false,
        Person: person.Id
    });
    const visit = visitRecords.reverse();
    person.visitRecords = visit;

    return person;
}

function savePicture(data, picName){
    if(data) {
        const savePath = path.join(savepath.paths.recognize, picName);
        console.log(savePath);
        fs.writeFileSync(savePath, data);

        return savePath; 
    }
    throw(errors.snapError);
    outputLogger.error(errors.snapError);
}

function findAndRecord(personId, picName){
    let person = PersonDao.findOne({
        mid: personId
    });
    if(!person) {
        outputLogger.error(errors.dbQueryError);
        throw(errors.dbQueryError);

        return;
    }
    const date = new Date();
    const visitRecord = {
        Time: date.toLocaleString().replace(/上午|下午/,''),
        imagePath: `${savepath.staticPaths.recognize}/${picName}`,
        Person: person.Id,
        isInscription: false
    };
    VisitRecordDao.create(visitRecord);
    let visitRecords = VisitRecordDao.find({
        Person: person.Id
    });
    person.visitTimes = VisitRecordDao.count({
        isInscription: false,
        Person: person.Id
    });
    visitRecords = visitRecords.reverse();
    person.visitRecords = visitRecords;

    return person;
}

function createPersonAndUploadImage(person) {
    const megviiApi = Megvii.getApi();
    const name = uuid.v4();
    const user = megviiApi.createUser(name);
    const imagePath = `static/${person.imagePath}`;
    const image = fs.readFileSync(imagePath);
    person.mid = user.id;
    person.qrcode = makeQrCode(user.id, `${user.id}`);
    person.keyboardInscription = null;
    const result = megviiApi.uploadPhoto(image, user.id);
    if(result.code != 0){
        megviiApi.deleteUser(user.id);
        outputLogger.debug('error');
        outputLogger.error(errors.trainningError);
        throw(errors.trainningError);
        return ;
    }
    person.Id = PersonDao.create(person);

    const date = new Date();
    const visitRecord = {
        Time: date.toLocaleString().replace(/上午|下午/,''),
        imagePath: person.imagePath,
        Person: person.Id,
        isInscription: false
    };
    VisitRecordDao.create(visitRecord);
    console.log('visitRecord', visitRecord);
    
    return user.id;

}



function createInscription(personId, picName,keyboardInscriptionText) {
    let person = PersonDao.findOne({
        mid: personId
    });
    if(!person) {
        outputLogger.error(errors.dbQueryError);
        throw(errors.dbQueryError);

        return;
    }
    
    if(picName){
        const date = new Date();
        const visitRecord = {
            Time: date.toLocaleString().replace(/上午|下午/,''),
            imagePath: `${savepath.staticPaths.inscription}/${picName}`,
            Person: person.Id,
            isInscription: true
        };
        VisitRecordDao.create(visitRecord);    
    }else if(keyboardInscriptionText){
        PersonDao.update({
            keyboardInscription: keyboardInscriptionText
        },{
            mid: personId
        });
        console.log("update success~~~~~~~~~~~~~~~~`");
    }else{
        throw  new Error("no inscription available");
    }
    
}

module.exports = {
    savePicture,
    findAndRecord,
    createPersonAndUploadImage,
    getTimeLine,
    makeQrCode,
    createInscription
};
