'use strict';

// const FoscamFtpClient = require('../lib/foscam_ftp_client');
// const FaceRecognizer = require('../lib/face_recognizer');
// const Foscam = require('../lib/foscam');
// const Person = require('../models/Person');
// const VisitRecord = require('../models/visitrecord');
// const errors = require('../../config/errors');
// const config = require('../../config/index');
// // const foscamOptions = config.foscam;
// // const ftp = config.ftp;
// // const picPath = ftp.paths;
// // const ftpPeople = ftp.server;
// // const Recognition = config.recognition;
// // const recognition = Recognition.recognition;
// // const training = Recognition.training;
// const fs = require('fs');
// // const baseModel = require('../models/base.js');
// const path = require('path');
// const utils = require('../lib/utils');
// const copyFile = utils.copyFile;
// const models = require('../models');
// const connection = models.connection();
// const daos = models.getDaos();
// const PersonDao = daos.PersonDao;
// const VisitRecordDao = daos.VisitRecordDao;

function copyAndPutFtp(picNames, picNum, localpath){
    const copyAndPutFtpPromise = new Promise((resolve, reject) => {
        copyPictures(picNames, picNum, picPath.training, localpath, err => {
            if (err) {
                reject(err);
                console.log('copyFtpPictures', error);

                return;
            }
            // 将照片存到FTP上
            putFtpPictures(picNames, picNum, localpath, (error, ftpPath) => {
                if (error) {
                    reject(err);
                    console.log('putFtpPictures', error);
                    
                    return;
                }
                resolve(ftpPath);
            });
        })
    });

    return copyAndPutFtpPromise;    
}

function snapAndPutFtp(picNames, picNum, localpath) {
    const snapAndPutFtpPromise = new Promise((resolve, reject) => {
        savePictures(picNames, picNum, localpath, err => {
            if (err) {
                reject(err);

                return;
            }
            // 将照片存到FTP上
            putFtpPictures(picNames, picNum, localpath, (error, ftpPath) => {
                if (error) {
                    reject(err);

                    return;
                }
                resolve(ftpPath);
            });
        });
    });

    return snapAndPutFtpPromise;
}

function findAndSave(personIds, picNames) {
    const findAndSavePromise = new Promise((resolve, reject) => {
        findPersons(personIds, (err, persons) => {
            if (err) {
                reject(err);

                return;
            }
            if(persons == ""){
                console.log('persons is none');
                reject(errors.noIdError);

                return;
            }
            recordVisitings(persons, picNames, error => {
                if ( error ) {
                    reject(error);

                    return;
                }
                findPersons(personIds, (err, persons) => {
                    if (err) {
                        reject(err);

                        return;
                    }
                    console.log('findAndSave', persons);
                    resolve(persons);

                });
            });
        });
    });

    return findAndSavePromise;
}

function savePictureLocal(picNames, picNum, localpath) {
    const savePictureLocalPromise = new Promise((resolve, reject) => {
        savePictures(picNames, picNum, localpath, err => {
            if (err) {
                console.log(err);
                reject(err);

                return;
            }
            resolve(null);
        });
    });

    return savePictureLocalPromise;
}

function copyPictures(picNames, picNum, pathfrom, pathto, callback) {
    let localPicCount = 0;
    picNames.forEach( picName => {
        const filefrom = path.join(pathfrom, picName);
        const fileto = path.join(pathto, picName);
        copyFile(filefrom, fileto);
        // 1.jpg是图片路径,foscam进行抓拍，并且将图片以1.jpg的格式存在本地目录下
        
        localPicCount ++;
        if (localPicCount === picNum) {
            callback(null);

            return;
        }
    });
}

function savePictures(picNames, picNum, localpath, callback) {
    const options = {
        host: foscamOptions.host,
        port: foscamOptions.port,
        user: foscamOptions.user,
        password: foscamOptions.password
    };
    const foscam = new Foscam(options);
    let failedSaveCount = 0;
    let localPicCount = 0;
    picNames.forEach( picName => {
        // 1.jpg是图片路径,foscam进行抓拍，并且将图片以1.jpg的格式存在本地目录下
        foscam.saveSnapPitcure(path.join(localpath, picName), function(err) {
            if (err) {
                failedSaveCount ++;
            }
            else {
                localPicCount ++;
            }
            if (failedSaveCount + localPicCount === picNum) {
                if (failedSaveCount) {
                    callback(errors.snapError);

                    return;
                }
                callback(null);
            }
        });
    });
}

function putFtpPictures(picNames, picNum, localpath, callback) {
    let failedPutFtp = 0;
    let ftpPicCount = 0;
    const people = {
        host: ftpPeople.host,
        port: ftpPeople.port,
        user: ftpPeople.user,
        password: ftpPeople.password
    };
    // picNames .jpg
    // localpath /static/training 本地目录
    const foscamFtpClient = new FoscamFtpClient(people);
    // 1.jpg是图片路径，将本地目录下的1.jpg上传到指定的ftp的目录下，默认是/camera_picture/下的文件，并且返回ftpPath，即ftp下的文件目录
    picNames.forEach(picName => {
        foscamFtpClient.putImage(path.join(localpath, picName), picName, function(err, ftpPath) {
            if (err) {
                console.log('services.js putFtpPictures ', err)
                failedPutFtp ++;
            }
            else {
                ftpPicCount ++;
            }
            if (failedPutFtp + ftpPicCount === picNum) {
                if (failedPutFtp) {
                    callback(errors.ftpError);

                    return;
                }
                callback(null, ftpPath);
            }
        });
    });
}

function putTrainPictures(personId, peoplePath, picNames, picNum, localpath) {
    let failedPutFtp = 0;
    let ftpPicCount = 0;
    const people = {
        host: ftpPeople.host,
        port: ftpPeople.port,
        user: ftpPeople.user,
        password: ftpPeople.password
    };
    // picNames .jpg
    // localpath /static/training 本地目录
    // peoplePath hammer_hfut
    const putTrainPicturesPromise = new Promise((resolve, reject) => {
        const foscamFtpClient = new FoscamFtpClient(people);
        // 1.jpg是图片路径，将本地目录下的1.jpg上传到指定的ftp的目录下，默认是/camera_picture/下的文件，并且返回ftpPath，即ftp下的文件目录
        foscamFtpClient.mkdir(peoplePath, (err, ftpPath) => {
            if ( err ) {
                reject(errors.ftpError);

                return;
            }
            picNames.forEach(picName => {
                foscamFtpClient.putTrainImage(ftpPath, peoplePath, path.join(localpath, picName), picName, function(error, ftpPath) {
                    if (error) {
                        failedPutFtp ++;
                    }
                    else {
                        ftpPicCount ++;
                    }
                    if (failedPutFtp + ftpPicCount === picNum) {
                        if (failedPutFtp) {
                            reject(errors.ftpError);

                            return;
                        }
                        const putResult = {
                            ftpPath: ftpPath,
                            personId: personId
                        };
                        resolve(putResult);

                        return ;
                    }
                });
            });
        });
    });

    return putTrainPicturesPromise;
}

function recognizeFace(localpath) {
    const recognizeFacePromise = new Promise((resolve, reject) => {
        const faceRecognizer = new FaceRecognizer(recognition.path, recognition.cwd);
        faceRecognizer.recognize(localpath, function(err, std) {
            faceRecognizer.cleanSnapping(function(error, std) {
                console.log('recognizeFace', error);
                console.log(std);
            });
            if (err) {
                reject(errors.recognitionError);

                return; 
            }
            console.log("std", std);
            // console.log("stdout", std);
            // 进行判断，如果人脸识别程序识别出来返回json 值读取其中的personids，如果程序识别不到人脸，则为personIds赋值为空    
            if (std && std.successful) {
                const personIds = std.data.personids;
                resolve (personIds);

                return;
            }
            reject(errors.noFaceDetected);

            return;
        });
    });

    return recognizeFacePromise;
}

function findPersons(personIds, callback) {
    const persons = [];
    const personLength = personIds.length;

    let foundPersonCount = 0;
    let missedPersonCount = 0;
    personIds.forEach( personId => {
        Person.findOne({ id: parseInt(personId) }, function(err, person) {
            if (err) {
                missedPersonCount ++;
            }
            else {
                foundPersonCount ++;
                persons.push(person[0]);
            }
            if ( missedPersonCount + foundPersonCount === personLength ) {
                if ( missedPersonCount ) {
                    callback(errors.dbQueryError);

                    return;
                }
                callback(null, persons);
            }

        });
    });
}

function searchPerson(persons) {
    const searchPersonPromise = new Promise((resolve, reject) => {
         Person.findOne(persons , (err, person) => {
            if ( err ) {
                console.log(err);
                reject(errors.dbQueryError);

                return;
            }
            resolve(person);
         });
    });
    return searchPersonPromise;
}

function recordVisitings(persons, picNames, callback) {
    const personLength = persons.length;
    const date = new Date();

    let createdRecordCount = 0;
    let failedRecordCount = 0;
    // console.log('recordVisitings   persons  '+persons);
    persons.forEach((person, personIndex) => {
        const visitRecord = {
            Time: date.toLocaleString().replace(/上午|下午/,''),
            imagePath: `${ftp.staticPaths.recognize}/${picNames[personIndex]}`,
            Person: person.Id
        };

        VisitRecord.create(visitRecord, function(err, visitRecordId) {
            if (err) {
                failedRecordCount ++;
            }
            else {
                createdRecordCount ++;
            }

            if ( failedRecordCount + createdRecordCount === personLength ){
                if ( failedRecordCount ) {
                    return callback(errors.dbCreateError);
                }
                callback(null);
            }
        });
    });
}

function createPersons(person) {
    const createPersonsPromise = new Promise((resolve, reject) => {
        Person.create(person, function(err, insertId) {
            if (err) {
                reject(errors.dbCreateError);

                return;
            }
            resolve(insertId);
        });
    });

    return createPersonsPromise;
}

function removePersons(id) {
    const removePersonsPromise = new Promise( (resolve, reject) => {
        Person.remove(id, err => {
            if (err) {
                return reject(err);
            }

            return resolve(null);
        });
    })

    return removePersonsPromise;
}

function faceTraining(picNames, personId) {
    const faceTrainingPromise = new Promise((resolve, reject) => {
        const faceRecognizer = new FaceRecognizer(training.path, training.cwd);
        faceRecognizer.training(picNames, function(err, std) {
            faceRecognizer.cleanSnapping(function(err, std) {
                console.log(err);
                console.log('cleanSnapping', std);
            });

            if (err) {
                reject(errors.trainingError);
                console.log('facetrain', err);
                return;
            }
            let trainResult = {
                std: std,
                personId: personId
            }
            console.log('train std',std);

            trainResult = JSON.parse(trainResult.std);
            trainResult.personId = personId;
            console.log('trainResult training', trainResult);
            resolve(trainResult);
        });
    });

    return faceTrainingPromise;
}

function isEmptyString (value) {
    if (value === ``) {
        return true;
    }

    return false;
}

function readAndRemoveImage(localpath) {
    const imageData = fs.readFileSync(localpath);
    fs.unlink(localpath);

    return imageData;
}


module.exports = {
    copyAndPutFtp,
    findAndSave,
    snapAndPutFtp,
    putTrainPictures,
    savePictureLocal,
    recognizeFace,
    findPersons,
    recordVisitings,
    createPersons,
    faceTraining,
    readAndRemoveImage,
    removePersons,
};
