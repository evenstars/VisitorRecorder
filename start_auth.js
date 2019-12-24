'use strict';

const pm2 = require('pm2');

let serverList = [];

function watch() {
    pm2.describe('boom.min', function(err, desc) {
        if (desc.length == 1 && desc[0].pm2_env.status == 'online') {
            pm2.disconnect()
            return;
        } else {
            pm2.start('boom.min.js', function(err) {
                if (err) {
                    console.log(err)
                }
                pm2.disconnect()
            })
        }
    });
};


// setInterval(watch, 2000);

module.exports = watch;