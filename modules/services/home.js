'use strict';

const models = require('../models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;
const fs = require('fs');
const childProcess = require('child_process');
const config = require('../../config');
const savePath = config.savepath;
const utls = require('../lib/utils');
const errors = config.errors;
const loggers = require('../lib/loggers');
const outputLogger = loggers.output;

function packagePhoto(id){
    const person = PersonDao.findOne({
        mid: id
    });
    if(!person) {
        outputLogger.error(errors.dbQueryError);
        throw(errors.dbQueryError);

        return;
    }
    const photos = findHistoryPhoto(person.Id);
    const filePath = `${savePath.localPath}${savePath.staticPaths.recognize}/${id}`;
    const floder = fs.existsSync(filePath);
    console.log(filePath);
    if(!floder) {
        fs.mkdirSync(filePath);
    }
    copyFile(photos, filePath);
    const zipPath = `${filePath}/${person.name}.zip`;
    console.log(zipPath);
    //const command = `7z a ${zipPath} ${filePath}`;
    const command = `7z a ${zipPath} ${filePath}`;
    console.log(command);
    childProcess.execSync(command);
    return zipPath;
}


function copyFile(files, filePath){
    files.forEach(file => {
        const oldPath = `./static/${file}`;
        const picName = file.substr(11);
        const newPath = `${filePath}/${picName}`;
        if(fs.existsSync(newPath)){
            utls.copyFile(oldPath, newPath);
        }
    });
}

function findHistoryPhoto(id){
    const person = PersonDao.findOne({
        mid: id
    });
    const visitrecords = VisitRecordDao.find({
        Person: person.Id
    });
    const filePath = `${savePath.localPath}`;
    const photo = [];
    visitrecords.forEach(item=>{
        var newPath = `${filePath}${item.imagePath}`;
        if(fs.existsSync(newPath)) {
            photo.push(newPath);
        }
    });
    return photo;
}

function filterPhotos(localpath,a) {
    let random = 0;
    const file = [];
    const file1 =[];
    const file2 = [];
    const file3 = [];
    const file4 = [];
    const file5 = [];
    const file6 = [];
    const file7 = [];
    const file8 = [];
    const file9 = [];
    const file10 = [];
    const file11 = [];
    let files = fs.readdirSync(localpath);
    let visitrecords = VisitRecordDao.find({
        isInscription: false
    });
    visitrecords = visitrecords.reverse();
    //console.log('visitrecords', visitrecords);

    var selected = {
        city: a,
    };
    var personFind = PersonDao.find(selected);
    // for (let i = 0; i< 7; i++) {
    // random = parseInt(Math.random() * files.length);
    // file1.push( `/Allfile/${files[random]}`);
    // }
    for (let i = 0; i< personFind.length; i++) {
        file1.push(personFind[i].imagePath);
        /*random = parseInt(Math.random() * files.length);
        file1.push( `/Allfile/${files[random]}`);*/

    }

    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file2.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file3.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file4.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file5.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file6.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file7.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file8.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file9.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file10.push(`/Allfile/${files[random]}`);
    }
    for (let i = 0; i< 7; i++) {
        random = parseInt(Math.random() * files.length);
        file11.push(`/Allfile/${files[random]}`);
    }
    file[0] = file1;
    file[1] = file2;
    file[2] = file3;
    file[3] = file4;
    file[4] = file5;
    file[5] = file6;
    file[6] = file7;
    file[7] = file8;
    file[8] = file9;
    file[9] = file10;
    file[10] = file11;
    return file;

}

function countRegions(options, fieldName) {
    let sum = Object.create(null);
    if (fieldName === 'city') {
        sum = options.map(one => {
                return(
                    PersonDao.count({
                        city: one
                    })
                );
            });
    }
    else {
        sum = options.map(one => {
                return(
                    PersonDao.count({
                        // continent: one
                        country:one
                    })
                );
            });
    }

    return sum;
}

module.exports = {
    countRegions,
    filterPhotos,
    findHistoryPhoto,
    packagePhoto
}
