/*
    功能： url处理函数模块
 */
'use strict';

let ENV = process.env.NODE_ENV;
const utils = require('../lib/utils');
const uuid = require('uuid');
const config = require('../../config');
const savepath = config.savepath;
const Fiber = require('fibers');
const path = require('path');
const fs = require('fs');
const megvii = require('../lib/megvii');
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
const megviiConfig = require('../../config/megvii');
let Foscam = require('../lib/foscam');
// let Foscam = require('../../test/lib/foscam');

if (ENV == 'development' ) {
    Foscam = require('../../test/lib/foscam');
}

// 向大屏幕通过websocket传递到访记录
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8888 });
function broadcast(result) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(result));
        }
    }); 
}

// 识别人脸并比对结果
const actionRecognition = {
    handler(req, res) {
        const picName = `${uuid.v4()}.jpg`;
        const token = uuid.v4();
        pictures[token] = picName;
        const megviiApi = megvii.getApi();
        const foscam = new Foscam();
        const imageBuffer = foscam.snapPicture();
        recognizeServices.savePicture(imageBuffer, picName);
        const result = megviiApi.recognize(imageBuffer);
        console.log(result, 'try before -------');
        try{
            //测试此段代码与下面代码替换，可跳过识别进入识别成功页面
            // if (true) {
            //     const personId = 79;
            //     const person = recognizeServices.findAndRecord(personId, "c143ac58-c71c-44da-bf72-26f6e9f53dd5.jpg");
            if (result.person && result.person.confidence > megviiConfig.confidence) {
                const personId = result.person.id;
                const person = recognizeServices.findAndRecord(personId, picName);
                console.log('*****************************');
                console.log('person', person);
                broadcast(getTimeline(personId));
                res.json({
                    successful: true,
                    data: {
                        token: token,
                        detectedPerson: person
                    }
                });
                return;
            }
            res.json({
                successful: false,
                data: {
                    token: token,
                    image: `${savepath.staticPaths.recognize}/${picName}`
                }
            });
            return;
        }
        catch (e) {
            let error = config.errors[e.message];
            if ( !error ) {
                error = {
                    id: -1,
                    message: '系统内部异常'
                };
            }
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

//保存结果
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
                imagePath: `${savepath.staticPaths.recognize}/${picName}`,
                signature: `${savepath.staticPaths.signature}/${signatureName}`
            };
            person.province = req.body.province;
            person.city = req.body.city;
            person.country = req.body.country;
            let mid = recognizeServices.createPersonAndUploadImage(person);
            var keyboardInputInscription = req.body.keyboard_inscription;

            // if (req.body.inscription) {
            //     const inscriptionData = new Buffer(req.body.inscription, 'base64');
            //     const inscriptionName = `${uuid.v4()}.jpg`;
            //     fs.writeFileSync(`${savepath.paths.inscription}/${inscriptionName}`, inscriptionData);
            //     // recognizeServices.createInscription(mid, inscriptionName);
            //     recognizeServices.createInscription(mid, inscriptionName,keyboardInputInscription);
            // }
            if (req.body.inscription || keyboardInputInscription) {
                var inscriptionName = null;
                if(req.body.inscription){
                    const inscriptionData = new Buffer(req.body.inscription, 'base64');
                    inscriptionName = `${uuid.v4()}.jpg`;
                    fs.writeFileSync(`${savepath.paths.inscription}/${inscriptionName}`, inscriptionData);
                }
                recognizeServices.createInscription(mid,inscriptionName,keyboardInputInscription);
            }

            broadcast(getTimeline(mid));

            res.json({
                successful: true,
                data: {
                    id: mid
                }
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



const actionInscription = {
    handler(req, res) {
        const personId = req.body.id;
        var inscriptionName = null;
        // const inscriptionData = new Buffer(req.body.inscription, 'base64');
        // const inscriptionName = `${uuid.v4()}.jpg`;
        try{
            //changed
            if(req.body.inscription){
                const inscriptionData = new Buffer(req.body.inscription, 'base64');
                inscriptionName = `${uuid.v4()}.jpg`;
                fs.writeFileSync(`${savepath.paths.inscription}/${inscriptionName}`, inscriptionData);
            }
            recognizeServices.createInscription(personId, inscriptionName,req.body.keyboardInputContent);
            let timeline = {
                type: 'timeline'
            };
            broadcast(getTimeline(personId));
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
            }
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
                detectedPerson: person
            }
        });
    }
}


const actionUpdateSignature = {
    handler (req, res) {
        const personId = req.body.id;
        const sinatureName = `${uuid.v4()}.jpg`;
        try{
            const signatureData = new Buffer(req.body.signature, 'base64');
            if (!personId) {
                outputLogger.error(config.errors.dbQueryError);
                throw(config.errors.dbQueryError);

                return;
            }
            let person = PersonDao.update({
                signature: `${savepath.staticPaths.signature}/${sinatureName}`
            },{
                mid: personId
            });
            fs.writeFileSync(`${savepath.paths.signature}/${sinatureName}`, signatureData); 
            broadcast(getTimeline(personId));
            res.json({
                successful: true
            }) ;
        }
        catch(e) {
            let error = config.errors[e.message];
            if ( !error ) {
                error = {
                    id: -1,
                    message: '系统内部异常'
                };
            }
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


const getTimeline = function(mid){
    const person = recognizeServices.getTimeLine(mid);
    let timeline = {
        successful: true,
        type: 'timeline',
        data: {
            detectedPerson: person
        }
    };
    return timeline;
}


module.exports = {
    actionUpdateSignature,
    actionGetTimeline,
    actionInscription,
    actionTraining,
    actionRecognition
}