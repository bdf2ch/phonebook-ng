var express = require('express');
var parser = require('body-parser');
//const uploader = require('express-fileupload');
var pg = require('pg');
var app = express();
//var users = require('./users');
var phoneBook = require('./phone-book');
var ldap = require('./ldap');
//var db = require('./postgres');
var postgres = require('./postgres');
var async = require('async');

//ldap.login('kolu0897', 'zx12!@#$');



var config = {
    user: 'docuser',
    database: 'phone',
    password: 'docasu',
    host: '10.50.0.242',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};


var pool = new pg.Pool(config);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});



app
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Credentials', true);
        next();
    })
    //.use(uploader())
    .use(parser.json())
    .post('/api', function (request, response, next) {
        console.dir(request.body);

        //pool.connect(function(err, client, done) {
        //    if(err) {
        //        return console.error('error fetching client from pool', err);
        //    }

        //    var query = null;
            switch (request.body.action) {
                //case 'getAllUsers': query = users.getAllUsers(); break;
                //case 'getUserById': query = users.getUserById(request.body.data); break;
                //case 'getPortionOfUsers': query = users.getPortionOfUsers(request.body.data); break;
                //case 'searchUsers': query = users.searchUsers(request.body.data); break;
                //case 'getAllPhoneBookDivisions': query = phonebook.getAllDivisions(); break;
                //case 'addPhoneBookDivision': query = phonebook.addDivision(request.body.data); break;
                //case 'editPhoneBookDivision': query = phonebook.editDivision(request.body.data); break;
                //case 'getAllAts': query = phonebook.getAllAts(); break;
                case 'getDivisionList': query = phoneBook.getDivisionList(); break;
                case 'getContactGroupsByDivisionId': query = phoneBook.getContactsByDivisionId(request.body.data); break;
                case 'logIn': query = phoneBook.logIn(request.body.data); break;
            }


            //if (query) {
            //    console.log(query);
            //    client.query({text: query['text'], values: query['values'] ? query['values'] : []}, function(err, result) {
            //        done(err);
            //        if(err) {
            //            console.error('error running query', err);
            //            return;
            //        }
            //        result = result.rows[0][query['func']];
            //        response.statusCode = 200;
            //        response.setHeader('Content-Type', 'application/json; charset=utf-8');
            //        response.end(JSON.stringify(result));
            //    });
            //}
        //});
        //var answer = async.compose(postgres.query(), phoneBook.);
        async.series(function (callback) {}, function (callback) {}, function (callback) {
            result = result.rows[0][query['func']];
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(result));
            callback(null);
        });
    })
    .listen(4444, function () {
        console.log('Server started at 4444');
    });
