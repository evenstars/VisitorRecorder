'use strict';

let base = require('./base');

function Text(){
	return {
		type: 'string'
	};
}
function UObject(name){
	return {
		type: 'UObject',
		name: name
	};
}
function Integer(){
	return {
		type: 'integer'
	};
}
function DateTime(){
	return {
		type: 'date'
	};
}
function Bool(){
    return {
        type: 'boolean'
    };
}

let daos = null;

function getDaos() {
    if ( daos == null ) {
        daos = Object.create(null);

        daos.PersonDao = base.createModel('Person', {
            name: Text(),
            visitRecords: UObject('VisitRecord'),
            imagePath: Text(),
            lastVisitTime: DateTime(),
            city: Text(),
            province: Text(),
            // district: Text(),
            country:Text(),
            signature: Text(),
            Id: Text(),
            mid: Text(),
            KeyboardInscription:Text()
        });

        daos.VisitRecordDao = base.createModel('VisitRecord', {
            isInscription: Bool(),
            Time: DateTime(),
            imagePath: DateTime(),
            Person: UObject('Person')
        });


    };
    return daos;
}
module.exports = {
    getDaos,
    connection: base.connection
};