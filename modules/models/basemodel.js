'use strict'
let config = require('../../config');
let database = config.database;
let mysql = require('mysql');
let getConnection = require('../lib/connection').getConnection;

class BaseModel{
}

let connection = getConnection();

BaseModel.insert = function (table, fields, callback){
    let value = [];
    let insertsql = 'INSERT INTO ' + table + ' SET ';
    let i = 0;
    for (let key in fields){
        if (i) {insertsql = insertsql + ', '}
        insertsql = insertsql + key + ' = ?';
        value.push(fields[key]);
        i = 1;
    }
    console.log(insertsql);
    console.log(value);
    
    let connection = getConnection();
    connection.query(insertsql, value, function(err, res){
        if (err) {
            callback(err, null);
            return;
        }
		
        callback(null, res.insertId);
    });
};

BaseModel.update = function (table, fields, wheres, callback){
	let value = [];
	let updatesql = 'UPDATE ' + table + ' SET ';
	let i = 0;
	for (let key in fields){
        if (key != 'id') {
            if (i) {updatesql = updatesql + ', '}
            updatesql = updatesql + key + ' = ?';
            value.push(fields[key]);
            i = 1;
        }
	}
	
    let columns = Object.keys(wheres);
    let selectsql = null;
    if (columns.length) {
        updatesql = updatesql + ' WHERE ';

        updatesql += columns.map(column => {
            return `${column} = ?`
        }).join(' AND ');
        updatesql += ';';

        columns.forEach(column => {
            value.push(wheres[column]);
        });
    }
    console.log(updatesql);
    console.log(value);
	
    let connection = getConnection();
	connection.query(updatesql, value, function(err, res){
		if (err) {
            callback(err);
            return;
        }
		callback(null);
	});
};

BaseModel.remove = function (table, wheres, callback){
	let columns = Object.keys(wheres);
	let deletesql = null;
    let values = [];
	if (!columns.length) {
		deletesql = 'DELETE FROM ' + table + ';';
	} else {
		deletesql = 'DELETE FROM ' + table + ' WHERE ';

        deletesql += columns.map(column => {
            return `${column} = ?`
        }).join(' AND ');
        deletesql += ';';

        values = columns.map(column => {
            return wheres[column];
        });
	}
	console.log(deletesql);
	console.log(values);
	
    let connection = getConnection();
	connection.query(deletesql, values, function(err, res){
		if (err) {
            callback(err);
            return;
        }
		callback(null);
	});
};

BaseModel.find = function (table, wheres, callback){
	let columns = Object.keys(wheres);
	let selectsql = null;
    let values = [];
	if (!columns.length) {
		selectsql = 'SELECT * FROM ' + table + ';';
	} else {
		selectsql = 'SELECT * FROM ' + table + ' WHERE ';

        selectsql += columns.map(column => {
            return `${column} = ?`
        }).join(' AND ');
        selectsql += ';';

        values = columns.map(column => {
            return wheres[column];
        });
	}
	console.log(selectsql);
	console.log(values);
	
    let connection = getConnection();
	connection.query(selectsql, values, function(err, rows){
		if (err) {
            callback(err, null);
            return;
        }
	
		callback(null, rows);
	});
};

BaseModel.count = function(table, wheres, callback) {
    let columns = Object.keys(wheres);
	let countsql = null;
    let values = [];
	if (!columns.length) {
		countsql = 'SELECT count(*) FROM ' + table + ';';
	} else {
		countsql = 'SELECT count(*) FROM ' + table + ' WHERE ';

        countsql += columns.map(column => {
            return `${column} = ?`
        }).join(' AND ');
        countsql += ';'

        values = columns.map(column => {
            return wheres[column];
        });
	}
	console.log(countsql);
	console.log(values);
    
    let connection = getConnection();
    connection.query(countsql, values, function(err, rows){
		if (err) {
            callback(err, null);
            return;
        }
	
		callback(null, rows[0]['count(*)']);
	});
}

module.exports = {
	BaseModel
}
