'use strict';

let fs = require('fs');

function responseError(res, error) {
    res.json({
        successful: false,
        error: error
    });
}

function copyFile(path1, path2) {
    let fileContent = fs.readFileSync(path1);
    fs.writeFileSync(path2, fileContent);
}

module.exports = {
    responseError,
    copyFile
};
