'use strict';

const lib = {
    HttpClient: require('./http_client'),
};
const config = require('../../config');
const foscam = config.foscam;
const http = require('http');
const uuid = require('uuid');
const MultipartEntity = lib.HttpClient.MultipartEntity;
const fs = require('fs');

class Foscam {
    constructor() {
        this._client = new lib.HttpClient();
    }

    snapPicture(){
        const data = this.requestGet({
            path: '/cgi-bin/CGIProxy.fcgi',
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            query: {
                usr: foscam.user,
                pwd: foscam.password,
                cmd: 'snapPicture2'
            }
        });
        console.log(data);
        return data;
    }

    requestGet(options) {
        const query = Object.create(null);
        if ( options.query ) {
            Object.keys(options.query).forEach(key => {
                query[key] = options.query[key];
            });
        }

        const result = this._client.requestSync({
            requester: http.request,
            method: 'get',
            userAgent: options.userAgent,
            host: foscam.host,
            port: foscam.port,
            path: options.path,
            query: query
        });

        const data = result.data;
        return data;
    }


}

module.exports = Foscam;
