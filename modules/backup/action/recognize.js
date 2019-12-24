'use strict';
const utils = require('../lib/utils');
const uuid = require('uuid');
const config = require('../../config');
const savepath = config.savepath;
const createFiber = require('fibers');
const path = require('path');
const fs = require('fs');
const megvii = require('../lib/megvii');
const Foscam = require('../lib/foscam');
const loggers = require('../lib/loggers');
const outputLogger = loggers.output;
const faceServices = require('../services/face');
const models = require('../models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;
const recognizeServices = require('../services/recognize');
const responseError = utils.responseError;
const pictures = [];
const signature = [];
let toTraining = false;
let toResult = false;
let tempToken = 0;
let smallPersonId = 0;

const actionRecognition = {
    handler(req, res) {
        const picName = `${uuid.v4()}.jpg`;
        const token = uuid.v4();
        pictures[token] = picName;
        const megviiApi = megvii.getApi();
        const foscam = new Foscam();
        const imageBuffer = foscam.snapPicture();
        // const result = megviiApi.requireVideo();
        // const imageBuffer = result.image;
        recognizeServices.savePicture(imageBuffer, picName);
        const result = megviiApi.recognize(imageBuffer);
        console.log(result, 'try befre -------');
        try{
            if (result.error == 0) {
                const personId = result.person.id;
                const person = recognizeServices.findAndRecord(personId, picName);
                console.log('*****************************');
                console.log('person', person);
                res.json({
                    successful: true,
                    data: {
                        token: token,
                        detectedPerson: person
                    }
                });
                toResult = true;
                smallPersonId = personId;
                tempToken = token;
                return;
            }
            res.json({
                successful: false,
                data: {
                    image: `${savepath.staticPaths.recognize}/${picName}`
                }
            });
            toResult = true;
            toTraining = true;
            tempToken = token;
            return;
        }
        catch (e) {
            let error = config.errors[e.message];
            if ( !error ) {
                error = {
                    id: -1,
                    message: '系统内部异常'
                };
            };
            error.exception = e;
            outputLogger.error(error);
            res.json({
                successful: false,
                error: {
                    id: error.id,
                    message: error.message
                }
            });
            
        }
    }
};
const actionTraining = {
    handler(req, res){
        const token = req.body.token;
        const picName = pictures[token];
        const signatureData = new Buffer(req.body.signature, 'base64');
        const signatureName = `${uuid.v4()}.jpg`;
        try{
            fs.writeFileSync(`${savepath.paths.signature}/${signatureName}`, signatureData);
            signature[token] = signatureName;
            const person = {
                // name: req.body.name,
                address: req.body.address,
                imagePath: `${savepath.staticPaths.recognize}/${picName}`,
                signature: `${savepath.staticPaths.signature}/${signatureName}`
            };
            if (req.body.continent == null || req.body.continent == ``) {
                person.city = req.body.city;
                person.continent = '亚洲';
            }
            else {
                person.continent = req.body.continent;
            }
            recognizeServices.createPersonAndUploadImage(person);
            res.json({
                successful: true
            });
        }
        catch(e) {
            let error = config.errors[e.message];
            if ( !error ) {
                error = {
                    id: -1,
                    message: '系统内部异常'
                };
            };
            error.exception = e;
            outputLogger.error(error);
            res.json({
                successful: false,
                error: {
                    id: error.id,
                    message: error.message
                }
            });
            
        }
    }
}

const actionGetTimeline = {
    handler(req, res) {
        const personId = req.query.id;
        const person = recognizeServices.getTimeLine(personId);
        res.json({
            successful: true,
            data: {
                token: tempToken,
                detectedPerson: person
            }
        });
    }
}

let toSnapping = false;
const actionCallSnapping = {
    handler(req, res) {
        toSnapping = true;
        res.json({
            successful: true
        });

    }
}
const actionIsSnapping = {
    handler(req, res) {
        let isSnapping = toSnapping;
        toSnapping = false;
        if(isSnapping){
            console.log(isSnapping, '########################')
        }
        res.json({
            successful: isSnapping,
            data: {
                isSnapping: isSnapping
            }
        });
        
    }
}

const actionIsTraining = {
    handler(req, res) {
        let isTraining = toTraining;
        let hasResult = toResult;
        if(hasResult) {console.log('%%%%%% is toTraining true %%%%%%');}
        toTraining = false;
        toResult = false;
        res.json({
            successful: hasResult,
            data: {
                id: smallPersonId,
                isTraining: isTraining,
                token: tempToken,
                path: `${savepath.staticPaths.recognize}/${pictures[tempToken]}`
            }
        });
    }
}
let toInit = false;
const actionCallInitMap = {
    handler(req, res) {
        toInit = true;
        res.json({
            successful: true
        });
    }
}
const actionIsInitMap = {
    handler(req, res) {
        let isInit = toInit;
        toInit = false;
        res.json({
            successful: true,
            data: {
                isInit: isInit
            }
        });
    }
}
module.exports = {
    actionRecognition,
    actionTraining,
    actionCallSnapping,
    actionIsSnapping,
    actionIsTraining,
    actionCallInitMap,
    actionIsInitMap,
    actionGetTimeline
}