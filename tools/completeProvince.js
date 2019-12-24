'use strict';

const createFiber = require('fibers');
const models = require('../modules/models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;

function main() {

    PersonDao.update({
        province: '江苏省'
    }, {
        city: '南京'
    });
    PersonDao.update({
        province: '江苏省'
    }, {
        city: '苏州'
    });

    PersonDao.update({
        province: '四川省'
    },{
        city: '成都'
    });
    PersonDao.update({
        province: '浙江省'
    },{
        city: '杭州'
    });
    PersonDao.update({
        province: '安徽省'
    },{
        city: '合肥'
    });
}

createFiber(main).run();
