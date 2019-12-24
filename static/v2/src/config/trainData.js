'use strict';

const data = require('./old_data');
const fs = require('fs');

let new_data = data.map((item) => {
    // console.log(item);
    return [
        item[0],
        item[1],
        0,
    ]
})

fs.writeFile('new_data.js', JSON.stringify(new_data), function (error) {
    console.log(error);
});
