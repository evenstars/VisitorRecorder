'use strict';

let config = require('../../config');
let database = config.database;
let mysql = require('mysql');

let connection = null;

let pool = mysql.createPool({
    host : database.host,
    user : database.user,
    password : database.password,
    database : database.database
});

function getConnection(){
	let query = function(sql, values, callback) {
        pool.getConnection(function(err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, values, function(qerr, res) {
                    conn.release();
                    callback(qerr, res);
                });
            }
        });
    }
    let connection = {
        query: query
    };
	return connection;
}

module.exports = {
	getConnection
}