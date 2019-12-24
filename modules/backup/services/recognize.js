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

// function snapAndSavePicture(picName) {
//     const savePath = path.join(savepath.paths.recognize, picName);
//     const foscam = new Foscam();
//     foscam.saveSnapPitcure(savePath);
// }

function makeQrCode(id, filename){
    const requrl = `https://cli.im/api/qrcode/code?text=192.168.1.101:${config.server.port}/home/historyPhoto/${id}&mhid=sELPDFnok80gPHovKdI`;
    request(requrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let uri = acquireData(body);
            uri = 'http:' + uri;
            return download(uri, filename);
        }
    });

}


function acquireData(data) {
    let $ = cheerio.load(data);  //cheerio解析data

    let qrcode = $('.qrcode_plugins_img')['0'].attribs.src; 
    return qrcode;
    
}

var download = function(url, filename){
    const path = savepath.localPath + savepath.staticPaths.qrcode + '/' + filename;
    request.head(url, function(err, res, body){
        console.log(path);
        request(url).pipe(fs.createWriteStream(path));
    });
    return savepath.staticPaths.qrcode + '/' + filename;
};

function getTimeLine(id){
    console.log(id);
    let person = PersonDao.findOne({
        Id: id
    });
    if(!person) {
        outputLogger.error(errors.dbQueryError);
        return;
    }
    let visitRecords = VisitRecordDao.find({
        Person: id
    });
    const visit = visitRecords.reverse();
    person.visitRecords = visit;
    qrcode.toDataURL('/home/historyPhoto/' + id, (err, url) => {
        console.log(url);
    });
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
        Id: personId
    });
    if(!person) {
        outputLogger.error(errors.dbQueryError);
        return;
    }
    const date = new Date();
    const visitRecord = {
        Time: date.toLocaleString().replace(/上午|下午/,''),
        imagePath: `${savepath.staticPaths.recognize}/${picName}`,
        Person: person.Id
    };
    VisitRecordDao.create(visitRecord);
    let visitRecords = VisitRecordDao.find({
        Person: person.Id
    });
    visitRecords = visitRecords.reverse();
    person.visitRecords = visitRecords;
    person.visitRecords = visitRecords;

    return person;
}

function createPersonAndUploadImage(person) {
    const megviiApi = Megvii.getApi();
    const name = uuid.v4();
    const user = megviiApi.createUser(name);
    const imagePath = path.join(`static`,person.imagePath);
    const image = fs.readFileSync(imagePath);
    console.log('create person', person);
    console.log('megvii create user', user);
    console.log('buffer image', image);
    console.log('image path', imagePath);
    person.Id = user.id;
    person.qrcode = makeQrCode(person.Id, `${person.name}_${person.Id}`);
    const result = megviiApi.uploadPhoto(image, user.id);
    if(result.code != 0){
        megviiApi.deleteUser(user.id);
        throw(errors.dbQueryError);
        outputLogger.error(errors.dbQueryError);
        return false;
    }
    PersonDao.create(person);
    const date = new Date();
    const visitRecord = {
        Time: date.toLocaleString().replace(/上午|下午/,''),
        imagePath: `${imagePath}`,
        Person: person.Id
    };
    VisitRecordDao.create(visitRecord);
    console.log('visitRecord', visitRecord);

}

module.exports = {
    savePicture,
    findAndRecord,
    createPersonAndUploadImage,
    getTimeLine,
    makeQrCode
};
