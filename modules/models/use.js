let Person = require('./Person');
Person.findOne({Id : '1'}, function(err, newOne){
    console.log(newOne);
})