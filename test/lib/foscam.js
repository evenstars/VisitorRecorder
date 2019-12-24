'use strict';


let fs = require('fs');

class Foscam {
    constructor(options) {
        this._options = options;
    }

    snapPicture(callback) {
        let filename = 'E:/1.jpg';
        return fs.readFileSync(filename);
    }

    saveSnapPitcure(path, callback) {
        this.snapPicture(function(err, data) {
            fs.writeFile(path, data, function(err) {
                if(err) {return callback(err);}
                callback(null);
            });

        }) ;
    }
}

module.exports = Foscam;
