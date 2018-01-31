var express = require('express');
var parser = require('body-parser');
//var cookieParser = require('cookie-parser');
const uploader = require('express-fileupload');
var app = express();
var phoneBook = require('./phone-book');
var session = require('./session');
var ldap = require('./ldap');
var postgres = require('./postgres');
var async = require('async');
var path = require('path');
var process = require('process');
const upload = require('./upload');



process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});

process.on('ECONNRESET', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});
process.on('ETIMEDOUT', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});


async function send(response, result) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(result));
};


async function sendAsync(response, apiFunc) {
    try {
        let result = await apiFunc;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify(result));
    } catch (error) {
        console.log('error catched', error);
        response.status(500).send(error);
    }
};


app.use(function(req, res, next) {
        req.on('error', function (err) {
            console.log('error catched', err);
        });
        next();
    })
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Credentials', true);
        next();
    })
    .use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    })


    .use(express.static(path.resolve('/var/wwwn/phonebook/static/')))
    .use(express.static('/var/wwwn/phonebook/dist/'))
    .use(uploader())
    .use(parser.json())
    //.use(cookieParser())
    .get('*', (req, res) => {
        res.sendFile(path.resolve('/var/wwwn/phonebook/dist/index.html'));
    })
    .post('/api', function (request, response, next) {
        console.dir(request.body);
        console.dir(request.cookies);





        var queue = [];
        switch (request.body.action) {
            case 'getInitialData': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getInitialData)]; break;
            case 'getSession': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getSession)]; break;
            case 'getDivisionList': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getDivisionList)]; break;
            case 'getContactGroupsByDivisionIdRecursive': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getContactsByDivisionIdRecursive)]; break;
            case 'getContactsByDivisionId': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getContactsByDivisionId)]; break;
            case 'getFavoriteContacts': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getFavoriteContacts)]; break;
            case 'searchContacts': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.searchContacts)]; break;
            case 'addContact': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContact)]; break;
            case 'editContact': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editContact)]; break;
            case 'deleteContact': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteContact)]; break;
            case 'addContactToFavorites': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactToFavorites)]; break;
            case 'removeContactFromFavorites': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.removeContactFromFavorites)]; break;
            case 'addContactPhone': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactPhone)]; break;
            case 'editContactPhone': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editContactPhone)]; break;
            case 'deleteContactPhone': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteContactPhone)]; break;
            case 'addDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addDivision)]; break;
            case 'editDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editDivision)]; break;
            case 'deleteDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteDivision)]; break;
            case 'addOffice': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addOffice)]; break;
            case 'editOffice': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editOffice)]; break;
            case 'deleteOffice': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteOffice)]; break;
            case 'searchUsers': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.searchUsers)]; break;
            case 'logIn': queue = [async.asyncify(postgres.query), async.asyncify(ldap.logIn)]; break;
            case 'logOut': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.logOut), async.asyncify(session.remove)]; break;
            case 'LDAPAuth': queue = [async.asyncify(ldap.logInUser)]; break;
            case 'uploadPhoto': console.log(request.files); break;
            case 'setContactPhotoPosition': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.setContactPhotoPosition)]; break;
            case 'setContactDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.setContactDivision)]; break;
        };


        console.log(queue);
        var process = async.compose(...queue);
        process({data: request.body.data, response: response, request: request}, function (err, result) {
            console.log('error', err);
            console.log('result', result);
            if (err)
                send(response, { code: 1,  message: 'No such user' });
            else
                send(response, result);
        });

    })
    .post('/uploadPhoto', function (request, response) {
        upload.phoneBook.uploadContactPhoto(request, response, send);
    })
    .post('/uploadPhotoForModeration', (request, response) => {
        //upload.phoneBook.uploadContactPhotoForModeration(request, response)
        sendAsync(response, upload.phoneBook.uploadContactPhotoForModeration(request));
        //async send(response, await upload.phoneBook.uploadContactPhotoForModeration(request));
    })
    .listen(4444, function () {
        console.log('Server started at 4444');
    }).on('error', function(err){
        console.log('ON ERROR HANDLER');
        console.log(err);
    });






