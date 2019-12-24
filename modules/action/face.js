'use strict';

const utils = require('../lib/utils');
const uuid = require('uuid');
const config = require('../../config/index');
const createFiber = require('fibers');
const ftp = config.ftp;
const picPath = ftp.paths;
const picNum = ftp.picturesNum;
const localPath = ftp.localPath;
const path = require('path');
const fs = require('fs');

const faceServices = require('../services/face');

const responseError = utils.responseError;
const pictures = [];
const signature = [];


/*
    功能：存储照片并进行人脸识别
    
 */
const actionRecognition = function(req, res) {
    const token = req.body.token;
    const picNames = [pictures[token][0]];

    // 抓拍照片存在本地目录和ftp下
    faceServices
    .copyAndPutFtp(picNames, picNum.recognize, picPath.recognize)
    // .snapAndPutFtp(picNames, picNum.recognize, picPath.recognize)
    .then(() => {
        // 人脸识别
        console.log('picNames', picNames[0]);
        return faceServices.recognizeFace(picNames[0]);
    })
    .then(personIds => {
        // 查找person信息并存储在visitrecord
        return faceServices.findAndSave(personIds, picNames);
    })
    .then(persons => {
        console.log('persons', persons);
        res.json({
            successful: true,
            data: {
                detectedPersons: persons
            }
        });
    })
    .catch(err => {
        console.log('reocgnize error', err);
        
        responseError(res, err);
    });
};

/*
    功能：生成照片id，进行存储
 */
const actionSnapping = function(req, res) {
    const picNames = [];
    for (let i = 0; i < picNum.training; i ++) {
        picNames.push(`${uuid.v4()}.jpg`);
    }

    faceServices.savePictureLocal(picNames, picNum.training, picPath.training)
    .then( () => {
        const token = uuid.v4();
        pictures[token] = picNames;
        // res.redirect(`/face_recognition/training?token=${token}&name=hammer&address=hfut`);
        res.json({
            successful: true,
            data: {
                token: token,
                path: picNames
            }
        });
    })
    .catch(err => {
        console.log(err);
        responseError(res, err);
    });
};

const actionTraining = function(req, res) {
    const token = req.body.token;
    const picNames = pictures[token];
    console.log('Training picNames',picNames);
    const signatureData = new Buffer(req.body.signature, 'base64');
    const signaturePath = `${uuid.v4()}.jpg`;
    fs.writeFileSync(`${picPath.training}/${signaturePath}`, signatureData);
    signature[token] = signaturePath;

    console.log('signature', `${picPath.training}/${signaturePath}`);
    const person = {
        name: req.body.name,
        address: req.body.address,
        imagePath: `/training/${picNames[0]}`,
        signature: `/training/${signaturePath}`
    };
    if (req.body.continent == null || req.body.continent == ``) {
        person.city = req.body.city;
        person.continent = '亚洲';
    }
    else {
        person.continent = req.body.continent;
    }
    console.log('Training person', person);
    const peoplePath = `${person.name}_${person.address}`;
    let currentPersonId = null;
    let detectedPerson = false;
    // res.json({
    //     successful: true
    // });
    // return;

    faceServices.createPersons(person)
    .then(personId => {
        currentPersonId = personId;

        return faceServices.putTrainPictures(personId, peoplePath, picNames, picNum.training, picPath.training);
    })
    .then(putResult => {
        console.log(`${localPath}/camera_picture/training/${peoplePath} ${peoplePath} ${putResult.personId}`);

        return faceServices.faceTraining(`${localPath}/camera_picture/training/${peoplePath} ${peoplePath} ${putResult.personId}`, putResult.personId);
    })
    .then(trainResult => {
        detectedPerson = trainResult.detected;

        utils.copyFile(`${ftp.paths.training}/${picNames[0]}`,
            `${ftp.paths.recognize}/${picNames[0]}`);

        if (! trainResult.detected) {
            console.log(`detected`);

            return faceServices.removePersons(currentPersonId);
        }

        return faceServices.findAndSave([currentPersonId], [picNames[0]]);
    })
    .then(() => {
        res.json({
            successful: detectedPerson
        });
    })
    .catch(err => {
        console.log(err);
        responseError(res, err);
    });
};

const performRecordVisitings = function(person, picNames, callback) {
    faceServices.searchPerson(person)
    .then(persons => {
        console.log(persons);
        const personIds = picNames.map(() => {
            return persons[0].Id;
        });

        return faceServices.findAndSave(personIds, picNames);
    })
    .then( persons => {
        if ( callback ) {
            callback(persons);
        }
    });
};

const performTraining = function(person, picNames, callback) {
    console.log(picNames);
    person.imagePath = `/training/${picNames[0]}`;

    if (person.continent == null) {
        person.continent = '亚洲';
    }

    console.log('person', person);
    const peoplePath = `${person.name}_${person.address}`;
    // 插入Person信息
    let currentPersonId = null;
    let detectedPerson = false;

    faceServices.createPersons(person)
    .then(personId => {
        currentPersonId = personId;

        return faceServices.putTrainPictures(personId, peoplePath, picNames, picNum.training, picPath.training);
    })
    .then(putResult => {
        console.log(1);
        console.log(`${localPath}/camera_picture/training/${peoplePath} ${peoplePath} ${putResult.personId}`);

        return faceServices.faceTraining(`${localPath}/camera_picture/training/${peoplePath} ${peoplePath} ${putResult.personId}`, putResult.personId);
    })
    .then(trainResult => {
        detectedPerson = trainResult.detected;

        utils.copyFile(`${ftp.paths.training}/${picNames[0]}`,
            `${ftp.paths.recognize}/${picNames[0]}`);

        if (! trainResult.detected) {
            console.log(`detected`);

            return faceServices.removePersons(trainResult.personId);
        }

        return faceServices.findAndSave([currentPersonId], [picNames[0]]);
    })
    .then(() => {
        console.log(`信息录入结果：${detectedPerson}`);
        if ( callback ) {
            callback(detectedPerson);
        }
    })
    .catch(err => {
        console.log('信息录入失败');
        console.log(JSON.stringify(err));
    });
};

const actionSearch = function(req, res) {
    const name = req.body.name;
    const city = req.body.city;
    const continent = req.body.continent;
    console.log(name);
    const persons = {
        name: `'${name}'`
    };
    if (req.body.continent == null) {
        persons.city = `'${req.body.city}'`;
    }
    else {
        persons.continent = `'${req.body.continent}'`;
    }
    if ( name == null || name == `` ) {
        console.log(1);
        delete persons.name;
    }
    if ( city == null || city == `` ) {
        delete persons.city;
    }

    if ( continent == null || continent == `` ) {
        delete persons.continent;
    }
    console.log('serarch', persons);
    faceServices.searchPerson(persons)
    .then(person => {
        console.log(person);
        res.json({
            successful: true,
            persons: person
        });
    })
    .catch(err => {
        responseError(res, err);
    });
};

const actionRealTime = function(req, res) {
    const picNames = [];
    const picId = uuid.v4();
    picNames.push(`${picId}.jpg`);
    faceServices.savePictureLocal(picNames, 1, picPath.snapping)
    .then( () => {
        res.json({
            successful: true,
            data: {
                path: picNames
            }
        });
    })
    .catch(err => {
        console.log(err);
        responseError(res, err);
    });
};

const actionGetSanppedImage = function(req, res) {
    const imageData = faceServices.readAndRemoveImage(path.join(picPath.snapping, req.query.path));

    res.writeHead(200, {
        'Content-Type': 'image/jpeg'
    });
    res.end(imageData);
};

const actionShowPhotoWall = function( req, res) {
    faceServices.filterPhotos('./static/FTP_Files/AllFile', (err, file) => {
        if ( err ) {
            console.log(err);

            return;
        }

        res.json({
            successful: true,
            data: {
                files: file
            }
        });
    });
};

const actionCountContinent = function(req, res) {
    const continents = ['北美洲', '南美洲', '非洲', '欧洲', '亚洲', '大洋洲'];
    createFiber(function() {
        try {
            const result = faceServices.countRegions(continents, 'continent');
            res.json({
                successful: true,
                data: {
                    continents: result
                }
            });
        }
        catch (e) {
            console.log(JSON.stringify(e));
            responseError(res, e);
        }
    }).run();
};

const actionCountCity = function(req, res) {
    const cities = ['北京', '南京', '合肥', '上海', '广州', '杭州', '西安', '成都', '苏州'];

    createFiber(function() {
        try {
            console.log('actionCountCity');
            const result = faceServices.countRegions(cities, 'city');
            console.log('actionCountCity', result);
            res.json({
                successful: true,
                data: {
                    cities: result
                }
            });
        }
        catch (e) {
            console.log(JSON.stringify(e));
            responseError(res, e);
        }
    }).run();
};

let toSnapping = false;
const actionCallSnapping = function(req, res) {
    toSnapping = true;
    console.log('callSnapping');
    res.json({
        successful: true
    });
}

const actionIsSnapping = function(req, res) {
    let isSnapping = toSnapping;
    toSnapping = false;

    res.json({
        successful: true,
        data: {
            isSnapping: isSnapping
        }
    });
}

let toTraining = false;
let tempToken = 0;
const actionCallTraining = function(req, res) {
    toTraining = true;
    tempToken = req.body.token;
    console.log('tempToken', tempToken);

    res.json({
        successful: true
    });
}

const actionIsTraining = function(req, res) {
    let isTraining = toTraining;
    if(isTraining) {console.log('true');}
    toTraining = false;

    res.json({
        successful: true,
        data: {
            isTraining: isTraining,
            token: tempToken,
            path: pictures[tempToken]
        }
    })
}

let toInit = false;
const actionCallInitMap = function(req, res) {
    toInit = true;

    res.json({
        successful: true
    });
}

const actionIsInitMap = function(req, res) {
    let isInit = toInit;
    toInit = false;

    res.json({
        successful: true,
        data: {
            isInit: isInit
        }
    });
}

module.exports = {
    actionRecognition,
    actionSnapping,
    actionTraining,
    actionSearch,
    actionRealTime,
    actionGetSanppedImage,
    actionShowPhotoWall,
    actionCountContinent,
    actionCountCity,
    performTraining,
    performRecordVisitings,
    actionCallSnapping,
    actionIsSnapping,
    actionIsTraining,
    actionCallTraining,
    actionCallInitMap,
    actionIsInitMap
};
