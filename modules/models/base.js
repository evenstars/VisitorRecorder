'use strict'
let BaseModel = require('./basemodel').BaseModel;
let Fiber = require('fibers');
let executeSync = require('../lib/executeSync');
let getConnection = require('../lib/connection').getConnection;

var allModels = {
};

function createModel(modelName, schema){
	class Model extends BaseModel{
		constructor(values){
			super();
			
			Object.defineProperty(this,
				'id', {
					get(){
						return this.id;
					},
					set(id){
						this.id = id;
					},
					enumerable: true,
					configurable: false
				});
		}
	}
		
	Model.create = function(object) {
		let createAsync = BaseModel.insert.bind(null, modelName, object);
		return executeSync(createAsync);
	};
    
	Model.update = function(object, options){
		let updateAsync = BaseModel.update.bind(null, modelName, object, options);
		return executeSync(updateAsync);
	};
    
	Model.find = function(options){
		let findAsync = BaseModel.find.bind(null, modelName, options);
		return executeSync(findAsync);
	};
    
	Model.findOne = function(options){
		let result = Model.find(options);
		if (result.length > 0) {
			return result[0];
		} else {
			return null;
		}
	}
    
	Model.remove = function(options){
		let removeAsync = BaseModel.remove.bind(null, modelName, options);
		return executeSync(removeAsync);
	}
    
    Model.count = function(options){
		let countAsync = BaseModel.count.bind(null, modelName, options);
		return executeSync(countAsync);
	}
	
	allModels[modelName] = Model;
	return Model;
}

class MySqlConnection {
	constructor(connection) {
		this._connection = connection;
	}
	
	query(sql, values) {
		let queryAsync = this._connection.query.bind(this._connection, sql, values);
		return executeSync(queryAsync);
	}
}

let connection = null;
function getSqlConnection(){
	if ( connection === null ) {
		connection = new MySqlConnection(getConnection());
	}
    return connection;
}

module.exports = {
	createModel,
	connection: getSqlConnection
}