'use strict';

const lib = {
    HttpClient: require('./http_client'),
    WebSocket: require('./web_socket'),
    // uploadFile: require('./uploadFile')
};
const config = require('../../config');
const megvii = config.megvii;
const http = require('http');
const uuid = require('uuid');
const MultipartEntity = lib.HttpClient.MultipartEntity;

class Megvii {
    constructor() {
        this._client = new lib.HttpClient();
        this._ws = new lib.WebSocket();
        // this._uf = new lib.uploadFile();
    }

    setToken(token) {
        this._screen_token = token;
    }

    login(){
        const data = this.requestPost({
            path: '/auth/login',
            dataType: 'application/json',
            userAgent: 'Koala Admin',
            data: {
                username: megvii.username,
                password: megvii.password
            }
        });

        return data;
    }

    deleteUser(id){
        const data = this.requestDelete({
            path: `/subject/${id}`,
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
        });
        console.log(data);
        return data;
    }

    getScreens() {
        const data = this.requestGet({
            path: '/system/screen',
            userAgent: 'Koala Admin'          
        });

        return data;
    }

    padLogin(){
        const data = this.requestPost({
            path: '/pad/login',
            dataType: 'application/json',
            userAgent: 'Koala Admin',
            data: {
                username: megvii.username,
                password: megvii.password,
                pad_id: megvii.padId,
                device_type: 2
            }            
        });
        return data;
    }

    requireVideo() {
        const data = this.webSocket({
            path:'/video',
            data: {
                url: megvii.videoUrl
            }
        });
        console.log('data', data);

        return data
    }

    getList(){
        const data = this.requestGet({
            path: '/mobile-admin/subjects',
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
        });

        return data;
    }

    getPerson(id){
        const data = this.requestGet({
            path: '/subject/' + id,
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
        });

        return data;
    }

    createUser(name){
        const data = this.requestPost({
            path: '/subject',
            dataType: 'application/json',
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            data: {
                subject_type: 0,
                name: name
            }
        });

        return data.data;
    }

    getUsers() {
        const data = this.requestGet({
            path: '/mobile-admin/subjects/list',
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            query: {
                category: 'employee',
                page: 1,
                size: 50
            }
        });

        return data.data;
    }

    uploadPhoto(photo, id) {
        const entity = new MultipartEntity();
        entity.addField('subject_id', id);
        entity.addFile('photo', '1.jpg', photo);

        const data = this.requestPostRawData({
            path: '/subject/photo',
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            data: entity
        });

        console.log(data);
        return data;
    }


    recognize(image) {
        const entity = new MultipartEntity();
        entity.addField('screen_token', megvii.padToken);
        entity.addFile('image', '1.jpg', image);
        const data = this.requestPostRawData({
            path: '/recognize',
            port: 8866,
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            data: entity
        });


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
            host: megvii.host,
            path: options.path,
            query: query
        });

        const data = JSON.parse(result.data);
        return data;
    }

    requestPostRawData(options) {
        const query = Object.create(null);
        if ( options.query ) {
            Object.keys(options.query).forEach(key => {
                query[key] = options.query[key];
            });
        }

        const result = this._client.requestSync({
            requester: http.request,
            method: 'post',
            host: megvii.host,
            port: options.port,
            userAgent: options.userAgent,
            path: options.path,
            query: query,
            data: options.data,
            dataType: options.dataType
        });

        const data = JSON.parse(result.data);
        return data;
    }

    requestPost(options) {
        const query = Object.create(null);
        if ( options.query ) {
            Object.keys(options.query).forEach(key => {
                query[key] = options.query[key];
            });
        }

        const result = this._client.requestSync({
            requester: http.request,
            method: 'post',
            host: megvii.host,
            userAgent: options.userAgent,
            path: options.path,
            query: query,
            data: JSON.stringify(options.data),
            dataType: options.dataType
        });

        const data = JSON.parse(result.data);
        return data;
    }

    requestDelete(options) {
        const query = Object.create(null);
        if ( options.query ) {
            Object.keys(options.query).forEach(key => {
                query[key] = options.query[key];
            });
        }

        const result = this._client.requestSync({
            requester: http.request,
            method: 'delete',
            host: megvii.host,
            userAgent: options.userAgent,
            path: options.path,
            query: query,
        });

        const data = JSON.parse(result.data);
        return data;
    }
    
    webSocket(options) {
        const result = this._ws.request({
            host: megvii.host,
            port: megvii.videoport,
            path: options.path,
            data: options.data
        });

        return result;
    }
}

function getApi() {
    const api = new Megvii();
    console.log(JSON.stringify(api.login()));
    const screenToken = api.padLogin().data.screen_token;
    api.setToken(screenToken);
    console.log(screenToken);

    return api;
}

module.exports = {
    getApi
};
