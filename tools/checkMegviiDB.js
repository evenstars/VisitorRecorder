'use strict';

const Megvii = require('../modules/lib/megvii');
const createFiber = require('fibers');
const fs = require('fs');
const models = require('../modules/models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;

function main() {
    const megvii = Megvii.getApi();


    const data = megvii.getList();
    fs.writeFile('./data/test.txt', JSON.stringify(data));
    let users = data.data;
    users.forEach(user => {
        let person = PersonDao.find({
            mid: user.id
        });
        if(!person) {
            console.log(person.id,'no db');
        }
    })
    // console.log(data);
}

createFiber(main).run();
