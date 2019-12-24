'use strict';

let fs = require('fs');
let uuid = require('uuid');
let ftp = require('../config/ftp');
let utils = require('../modules/lib/utils');
let faceActions = require('../modules/action/face')

function main() {
    let person = readInfo('tools/training/info.txt');
    console.log(person);
    let imageNames = getImages('tools/training/images');

    try { 
        faceActions.performTraining(person, imageNames, detectResult => {
            console.log(detectResult);

            process.exit(0);
        });
    }
    catch (e) {
        console.log(e);
    }
}

function readInfo(path) {
    let fileContent = fs.readFileSync(path, 'utf8');
    let fileLineBreaker = getFileLineBreaker(fileContent);

    let lines = fileContent.split(fileLineBreaker);
    let info = Object.create(null);

    lines.forEach(line => {
        let parts = line.split('=');
        let key = parts[0].trim();
        let value = parts[1];

        info[key] = value;
    });

    return info;
}

function getFileLineBreaker(content) {
    let breakers = ['\r\n', '\n\r', '\n', '\r'];

    for ( let breakerIndex in breakers ) {
        let breaker = breakers[breakerIndex];

        if ( content.indexOf(breaker) != -1 ) {
            return breaker;
        }
    }

    return '';
}

function getImages(dir) {
    let fileList = fs.readdirSync(dir);

    let renamedList = fileList.map(fileName => {
        let newName = uuid.v4() + '.jpg';
        let oldPath= `${dir}/${fileName}`;
        let newPath = `${ftp.paths.training}/${newName}`;

        console.log(`${oldPath} -> ${newPath}`);
        utils.copyFile(oldPath, newPath);

        return newName;
    });

    return renamedList;
}

main();