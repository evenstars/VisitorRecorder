'use strict';

const Megvii = require('../modules/lib/megvii');
const createFiber = require('fibers');
// const fs = require('../modules/lib/fs');
const fs = require('fs');
let http = require('http');
let defaultRequester = http.request;

function main() {
    const megvii = Megvii.getApi();

    // let fileName = './data/login.txt';

    // let data = JSON.stringify(megvii.login());
    // fs.writeFile(fileName, data);
    // console.log(data,'dtatata');
    //let getList = JSON.stringify(megvii.getList());
    //console.log('list', getList);
    //let getPerson = JSON.stringify(megvii.getPerson(1));
    //console.log('---------------------');
    //console.log(getPerson);
    // let files = fs.readdirSync('./data/wjj');
    // for(var i = 0; i < files.length; i++){
    //     let data = fs.readFileSync('./data/wjj/'+ files[i]);
    //     let write = JSON.stringify(megvii.recognize(data)); 
    //     fs.appendFileSync('./data/recognize_wjj.txt', write);       
    // }

    const users = megvii.getUsers();
    console.log(users);
    // megvii.deleteUser(3);
    //uploadPhoto.uploadFile('./data/1.jpg', data);
    //let uploadPhoto = JSON.stringify(uploadFile({subject_id : 1}, data));

    // let video = JSON.stringify(megvii.requireVideo());


    // let createUser = JSON.stringify(megvii.createUser("hammer"));
    // console.log(createUser);
    // let photo = fs.readFile('./data/1.jpg');

    // console.log(JSON.stringify(megvii.uploadPhoto(photo.toString('base64'))));

}

createFiber(main).run();
