'use strict';

let Fiber = require('fibers');
let model = require('./index');
let timeDao = model.TimeDao;
function main(){
	timeDao.remove({id : 8});
}

Fiber(main).run();