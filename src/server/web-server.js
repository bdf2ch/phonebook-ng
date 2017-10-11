var express = require('express');
var parser = require('body-parser');
//var cookieParser = require('cookie-parser');
const uploader = require('express-fileupload');
var pg = require('pg');
var app = express();
var phoneBook = require('./phone-book');
var ldap = require('./ldap');
var postgres = require('./postgres');
var async = require('async');
var path = require('path');
var fs = require('fs');


app
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Credentials', true);
        next();
    })
    .use(express.static(path.resolve('../../static')))
    .use(uploader())
    .use(parser.json())
    //.use(cookieParser())
    .post('/', function (request, response, next) {


    })
    .post('/uploadPhoto', function (request, response, next) {
        if (request.files.photo && request.body.userId) {
            let folderPath = path.resolve('../../static/assets/images/users/', request.body.userId.toString());
            let url = '/assets/images/users/' + request.body.userId.toString() + '/' + request.files.photo.name;
            let photoPath = path.resolve(folderPath, request.files.photo.name);
            let queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactPhoto)];
            let process = async.compose(...queue);
            console.log('folder path = ', folderPath);
            fs.exists(folderPath, (exists) => {
                if (!exists) {
                    fs.mkdir(folderPath, (err) => {
                        if (!err) {
                            request.files.photo.mv(photoPath, function(err) {
                                if (err) {
                                    return response.status(500).send(err);
                                } else {
                                    process({ contactId: request.body.userId, url: url }, function (err, result) {
                                        console.log('error', err);
                                        console.log('result', result);
                                        if (err)
                                            send({ code: 1,  message: 'Error uploading contact photo' });
                                        else
                                            send(result);
                                    });
                                }
                            });
                        }
                    });
                } else {
                    request.files.photo.mv(photoPath, function(err) {
                        if (err) {
                            return response.status(500).send(err);
                        } else {
                            process({ contactId: request.body.userId, url: url }, function (err, result) {
                                console.log('error', err);
                                console.log('result', result);
                                if (err)
                                    send({ code: 1,  message: 'Error uploading contact photo' });
                                else
                                    send(result);
                            });
                        }
                    });
                }
            });
        }


        /*
         let split = request.files.photo.name.split('.');
         let extension = split[split.length - 1];
         let url = '/assets/images/contacts/' + request.body.contactId.toString() + '.' + extension.toString();
         let photoPath = path.resolve('../../static/assets/images/contacts/', request.body.contactId.toString() + '.' + extension.toString());
         console.log('path', photoPath);
         request.files.photo.mv(photoPath, function(err) {
         if (err)
         return response.status(500).send(err);

         let queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactPhoto)];
         let process = async.compose(...queue);
         process({ contactId: request.body.contactId, url: url }, function (err, result) {
         console.log('error', err);
         console.log('result', result);
         if (err)
         send({ code: 1,  message: 'Error uploading contact photo' });
         else
         send(result);
         });

         });
         */


        function send(result) {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(result));
        };


    })
    .listen(80, function () {
        console.log('Server started at 80');
    });






