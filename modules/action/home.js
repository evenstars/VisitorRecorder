'use strict';

const Fiber = require('fibers');
const models = require('../models');
const connection = models.connection();
const daos = models.getDaos();
const PersonDao = daos.PersonDao;
const VisitRecordDao = daos.VisitRecordDao;
const homeServices = require('../services/home');
const config = require('../../config');
const savePath = config.savepath;
const recognizeServices = require('../services/recognize');

/*
数据库之中搜索用户
 */
const actionSearch = {
    handler(req, res) {
        console.log(req.body);
        // const province = req.body.province;
        // console.log(province);
        const persons = req.body;
        console.log('search', persons);
        var personFind = PersonDao.find(persons);
        console.log('personFind', personFind);

        res.json({
            successful: true,
            persons: personFind
        });
/*        if (req.body.continent == null) {
            persons.city = req.body.city;
        }
        else {
            persons.continent = req.body.continent;
        }
        if ( name == null || name == `` ) {
            console.log(1);
            delete persons.name;
        }
        if ( city == null || city == `` ) {
            delete persons.city;
        }

        if ( continent == null || continent == `` ) {
            delete persons.continent;
        }
*/

    }
};

/*
展示照片墙
 */
const actionShowPhotoWall = {
    handler(req, res) {
        var a =req.query.a;
        const file = homeServices.filterPhotos('./static/Allfile',a);
        res.json({
            successful: true,
            data: {
                files: file
            }
        });
    }
};

/*
  功能：计算各大洲人数
 */
const actionCountContinent = {
    handler(req, res) {
        const continents = ['北美洲', '南美洲', '非洲', '欧洲', '亚洲', '大洋洲'];
        const result = homeServices.countRegions(continents, 'continent');
        res.json({
            successful: true,
            data: {
                continents: result
            }
        });
    }
};

/*
    功能：计算所列城市人数
 */
const actionCountCity = {
    handler(req, res){
        const cities = ['北京', '南京', '合肥', '上海', '广州', '杭州', '西安', '成都', '苏州'];
        console.log('actionCountCity');
        const result = homeServices.countRegions(cities, 'city');
        console.log('actionCountCity', result);
        res.json({
            successful: true,
            data: {
                cities: result
            }
        });
        
    }
};

/*
取照片
 */
const actionGetPhotos = {
    handler(req, res) {
        const id = req.params.id;
        const photos = homeServices.findHistoryPhoto(id);
        res.json({
            successful: true,
            data: {
                photos: photos
            }
        });
    }
}

/*
取得照片文件
 */
const actionGetPhotoFile = {
    handler(req, res) {
        const id = req.params.id;
        const zipPath = homeServices.packagePhoto(id);
        res.sendFile(zipPath);
    }
}



module.exports = {
    actionShowPhotoWall,
    actionSearch,
    actionCountCity,
    actionCountContinent,
    //actionShowPhotoWall,
    actionGetPhotos,
    actionGetPhotoFile,
};
