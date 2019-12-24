'use strict';

let ENV = process.env.NODE_ENV;
const utils = require('../../modules/lib/utils');
const uuid = require('uuid');
const config = require('../../config');
const savepath = config.savepath;
const Fiber = require('fibers');
const path = require('path');
const fs = require('fs');
const megvii = require('../../modules/lib/megvii');
const loggers = require('../../modules/lib/loggers');
const outputLogger = loggers.output;
const faceServices = require('../../modules/services/face');
const models = require('../../modules/models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;
const recognizeServices = require('../../modules/services/recognize');
const responseError = utils.responseError;
const pictures = [];
const signature = [];
const megviiConfig = require('../../config/megvii');
let Foscam = require('../lib/foscam');



const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8888 });


function broadcast(result) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(result));
        }
    }); 
}

const actionRecognition = {
    handler(req, res) {
        const picName = `${uuid.v4()}.jpg`;
        const token = uuid.v4();
        pictures[token] = picName;
        // const megviiApi = megvii.getApi();
        const foscam = new Foscam();
        const imageBuffer = foscam.snapPicture();
        recognizeServices.savePicture(imageBuffer, picName);
        // const result = megviiApi.recognize(imageBuffer);
               // const result = megviiApi.recognize(imageBuffer);
            // unrecognized
        // const result = {
        //     "code":0,
        //     "data":{"avatar":"","company":{"attendance_on":false,"attendance_weekdays":[1,2,3,4,5],"consigner":null,"create_time":1482230123,"data_version":1486971449,"deployment":1,"door_range":[[9,0],[21,0]],"door_weekdays":[1,2,3,4,5],"feature_version":3,"id":2,"logo":"/static/screen/images/productlogo.png","name":"安徽泽众安全科技有限公司","remark":"","scenario":"其他"},"company_id":2,"id":2,"organization_id":null,"password_reseted":true,"permission":[],"role_id":2,"username":"739013159@qq.com","verify":false},
        //     "page":{}
        // }
        // recognized
        const result = {
             person: 
               { feature_id: 0,
                 confidence: 88.55644,
                 tag: '{"subject_type": 0, "description": "", "start_time": 0, "birthday": null, "id": 92, "remark": "", "name": "9d3d87aa-951e-4bb2-8a9d-c57085d0fd29", "title": "", "job_number": "", "entry_date": null, "end_time": 0, "department": "", "avatar": "/static/upload/photo/2017-02-15/e7b483341ec37500c5cd6c63f9df827c1275558e.jpg"}',
                 id: '20' },
              can_door_open: true,
              error: 0 } 
        console.log(result, 'try before -------');
        try{
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


function createPersonAndUploadImage(person) {
    // const megviiApi = Megvii.getApi();
    const name = uuid.v4();
    // const user = megviiApi.createUser(name);
    let user = {
        id:23333
    };
    const imagePath = `static/${person.imagePath}`;
    // const image = fs.readFileSync(imagePath);
    console.log('create person', person);
    console.log('megvii create user', user);
    // console.log('buffer image', image);
    console.log('image path', imagePath);
    person.mid = user.id;
    // person.qrcode = makeQrCode(user.id, `${user.id}`);
    person.qrcode = `/qrcode/1.jpg`
    // const result = megviiApi.uploadPhoto(image, user.id);
    let result = {
        code: 0
    };
    if(result.code != 0){
        // megviiApi.deleteUser(user.id);
        throw(errors.trainningError);
        outputLogger.error(errors.trainningError);
        return false;
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
            if (req.body.province == '海外') {
                person.province = req.body.city;
            }
            else {
                person.province = req.body.province;
                person.city = req.body.city;
                person.district = req.body.district;
            }

            let mid = createPersonAndUploadImage(person);

            if (req.body.inscription) {
                const inscriptionData = new Buffer(req.body.inscription, 'base64');
                const inscriptionName = `${uuid.v4()}.jpg`;
                fs.writeFileSync(`${savepath.paths.inscription}/${inscriptionName}`, inscriptionData);
                recognizeServices.createInscription(mid, inscriptionName);

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
        const inscriptionData = new Buffer(req.body.inscription, 'base64');
        const inscriptionName = `${uuid.v4()}.jpg`;
        try{
            fs.writeFileSync(`${savepath.paths.inscription}/${inscriptionName}`, inscriptionData);
            recognizeServices.createInscription(personId, inscriptionName);
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