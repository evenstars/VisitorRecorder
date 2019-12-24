'use strict';

const models = require('../modules/models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;

const Fiber = require('fibers');

function main(){
    let person = {
        mid: 200,
        city: '合肥',
        province: '安徽',
        imagePath: '/signature/1.jpg',
        signature: '/recognize/1.jpg'
    };
    PersonDao.create(person);
    person = {
        mid: 20,
        city: '北京'
    }
    PersonDao.create(person);
    person = {
        mid: 211,
        city: '北京'
    }
    PersonDao.create(person);
    person = {
        mid: 22,
        city: '北京'
    }
    PersonDao.create(person);
    person = {
        mid: 22,
        city: '合肥'
    }
    PersonDao.create(person);
}

Fiber(main).run();