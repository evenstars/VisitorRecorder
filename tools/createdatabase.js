//先npm install mysql

var mysql=require('mysql');
var config = require('../config');
var database = config.database;
var client = mysql.createConnection({  
    user: database.user,  
    password: database.password,
});
var createDatabase = 'CREATE DATABASE IF NOT EXISTS recognize character set utf8'; 
var useDatabase = 'use recognize';
var createPerson = 'CREATE TABLE IF NOT EXISTS Person (Id integer primary key AUTO_INCREMENT not null COMMENT \'来宾id\',name char(50) null COMMENT \'来宾姓名\',province varchar(255) null COMMENT \'来宾省会\',mid varchar(255) null, signature varchar(255) null,district varchar(255) null,city varchar(255) null COMMENT \'城市\',imagePath varchar(255) null COMMENT \'来宾照片\',qrcode varchar(255) null,index (name));';
var createVisitRecord = 'CREATE TABLE IF NOT EXISTS VisitRecord (Id integer primary key AUTO_INCREMENT not null COMMENT \'访问记录Id\', isInscription Boolean not null, Time Datetime not null COMMENT \'访问时间\',imagePath varchar(255) not null COMMENT \'图片路径\',Person integer not null COMMENT \'访问记录所属\',foreign key(Person) references Person(Id) );';
client.connect();
client.query( createDatabase,function selectCb(err, results) {
      if (err) {  
            console.log(err);  }  } );

client.query(useDatabase);

client.query( createPerson,function selectCb(err, results) {
      if (err)   console.log(err) 
             }  );
client.query( createVisitRecord,function selectCb(err, results) {
      if (err)   console.log(err) 
      console.log('success')       }  );




