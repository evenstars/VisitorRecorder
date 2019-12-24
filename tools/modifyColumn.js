//先npm install mysql

var mysql=require('mysql');
var config = require('../config');
var database = config.database;
var client = mysql.createConnection({  
    user: database.user,  
    password: database.password,
});
var createDatabase = 'CREATE DATABASE IF NOT EXISTS recognize'; 
var useDatabase = 'use recognize';
var addColumn = 'alter table Person add column province varchar(30); ';
var addDistict = 'alter table Person add column district varchar(30); ';
client.connect();
client.query( createDatabase,function selectCb(err, results) {
      if (err) {  
            console.log(err);  }  } );

client.query(useDatabase);

client.query( addColumn,function selectCb(err, results) {
      if (err)   console.log(err) 
        console.log('succeed');  
             }  );


client.query( addDistict,function selectCb(err, results) {
      if (err)   console.log(err) 
        console.log('succeed');  
             }  );


