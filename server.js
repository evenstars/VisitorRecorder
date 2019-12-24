'use strict';

let ENV = process.env.NODE_ENV;
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const homeAction = require('./modules/action/home');
const app = express();
const path = require('path');
const fibers = require('./modules/middlewares/fibers');
const generalAction = require('./modules/action/general');
const Fiber = require('fibers');
//const auth = require('./start_auth');
let recognizeAction;
if (ENV == 'development') {
    recognizeAction = require('./test/action/recognize');
}
else {
    recognizeAction = require('./modules/action/recognize');
}


let myApp = {
    combineSubOptions(options, optionNames) {
        let subOptions = {};
        optionNames
            .filter(optionName => optionName in options)
            .forEach(optionName => {
                subOptions[optionName] = options[optionName]
            });

        return subOptions;
    },
    get(url, action) {
        return myApp.handle('get', url, action.handler, action);
    },
    post(url, action) {
        return myApp.handle('post', url, action.handler, action);
    },
    handle(method, url, callback, options) {
        let grantOptions = null;
        let fieldOptions = null;
        if ( options ) {
            grantOptions = myApp.combineSubOptions(options, [
                    'login', 'privileges', 'roles'
            ]);

            fieldOptions = myApp.combineSubOptions(options, [
                    'fields'
            ]);
        }

        app[method](url, generalAction(callback, grantOptions, fieldOptions));
    }
};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(fibers);

myApp.post('/home/search', homeAction.actionSearch);
myApp.get('/home/photowall', homeAction.actionShowPhotoWall);
myApp.get('/home/count/continent', homeAction.actionCountContinent);
myApp.get('/home/count/city', homeAction.actionCountCity);
myApp.get('/home/historyPhoto/:id', homeAction.actionGetPhotos);
myApp.get('/home/historyPhotoFile/:id', homeAction.actionGetPhotoFile);

myApp.post('/face_recognition/signature', recognizeAction.actionUpdateSignature);
myApp.post('/face_recognition/inscription', recognizeAction.actionInscription);
myApp.get('/face_recognition/timeline', recognizeAction.actionGetTimeline);
myApp.post('/face_recognition/recognition', recognizeAction.actionRecognition);
myApp.post('/face_recognition/training', recognizeAction.actionTraining);


const server = app.listen(config.server.port, function() {
    const port = server.address().port;
    console.log(`Listening on port: ${port}`);
});
