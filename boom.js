'use strict';

const axios = require('axios');
const pm2 = require('pm2');
const config = require('./config/auth_config.js');

let url = `http://${config.auth_server.ip}:${config.auth_server.port}${config.auth_server.path}`
console.log(url);

function boom() {
    axios.get(url).then(res => {
        console.log(res.data);
        if (res.data.message == 'stop') {
            pm2.describe(config.appName, (err, desc) => {
                if (err) {
                    console.log(err);
                    pm2.disconnect();
                } else {
                    if (desc[0].pm2_env.status == 'online') {
                        pm2.stop(config.appName, function(err) {
                            if (err) {
                                console.log(err);
                                pm2.disconnect();
                            } else {
                                pm2.disconnect();
                            }
                        });
                    }
                }
            });
        } else if (res.data.message == 'start') {
            pm2.describe(config.appName, (err, desc) => {
                if (err) {
                    console.log(err);
                    pm2.disconnect();
                } else {
                    if (desc[0].pm2_env.status == 'stopped') {
                        pm2.start({ name: config.appName }, function(err) {
                            if (err) {
                                console.log(err);
                                pm2.disconnect();
                            } else {
                                pm2.disconnect();
                            }
                        });
                    }
                }
            });
        }
    }).catch(error => {
        console.log(error);
        pm2.describe(config.appName, (err, desc) => {
            if (err) {
                console.log(err);
                pm2.disconnect();
            } else {
                if (desc[0].pm2_env.status == 'online') {
                    pm2.stop(config.appName, function(err) {
                        if (err) {
                            console.log(err);
                            pm2.disconnect();
                        } else {
                            pm2.disconnect();
                        }
                    });
                }
            }
        });
    });
}

setInterval(boom, config.interval);