'use strict';

let Fiber = require('fibers');

module.exports = function(operation) {
	let fiber = Fiber.current;
	let error = null;
	let result = null;
	
	let callback = function(err, res){
		error = err;
		result = res;
		fiber.run();
	}
	operation(callback);

	Fiber.yield();

	if ( error ) {
		throw error;
	}

	return result;
}