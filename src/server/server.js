var express = require('express');
var parser = require('body-parser');
//var cookieParser = require('cookie-parser');
const uploader = require('express-fileupload');
var pg = require('pg');
var app = express();
var phoneBook = require('./phone-book');
var session = require('./session');
var ldap = require('./ldap');
var postgres = require('./postgres');
var async = require('async');
var path = require('path');
var fs = require('fs');
var process = require('process');
var jimp = require('jimp');
const nodemailer = require('nodemailer');



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


function send(response, result) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(result));
};


app
    .use(function(req, res, next) {
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


    .use(express.static(path.resolve('../static')))
    .use(express.static('../dist'))
    .use(uploader())
    .use(parser.json())
    //.use(cookieParser())
    //.get('*', (req, res) => {
    //    res.sendFile(path.resolve('../../dist/index.html'));
    //})
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
    .post('/uploadPhoto', function (request, response, next) {
        if (request.files.photo && request.body.contactId) {
            let folderPath = path.resolve('../../static/assets/images/users/', request.body.contactId.toString());
            let url = '/assets/images/users/' + request.body.contactId.toString() + '/' + request.files.photo.name;
            let fileNameArray = request.files.photo.name.split('.');
            let extension = fileNameArray[fileNameArray.length - 1];
            let photoPath = path.resolve(folderPath, request.files.photo.name);
            let queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactPhoto)];
            let process = async.compose(...queue);
            console.log('folder path = ', folderPath);
            console.log('rbody', request.body);
            fs.exists(folderPath, (exists) => {
                if (!exists) {
                    fs.mkdir(folderPath, (err) => {
                        if (!err) {
                            request.files.photo.mv(photoPath, function(err) {
                                if (err) {
                                    return response.status(500).send(err);
                                } else {
                                    process({ contactId: request.body.contactId, url: url }, function (err, result) {
                                        console.log('error', err);
                                        console.log('result', result);
                                        if (err)
                                            send({ code: 1,  message: 'Error uploading contact photo' });
                                        else {
                                            jimp.read(url).then(function (photo) {
                                                photo
                                                    .resize(480, 319)            // resize
                                                    .quality(80)                 // set JPEG quality
                                                    .write(photoPath); // save
                                            }).catch(function (err) {
                                                console.error(err);
                                            });

                                            jimp.read(url).then(function (photo) {
                                                photo
                                                    .resize(320, 240)            // resize
                                                    .quality(60)                 // set JPEG quality
                                                    .write('/assets/images/users/' + request.body.contactId.toString() + '/thumbnail.jpg'); // save
                                                send(result);
                                            }).catch(function (err) {
                                                console.error(err);
                                            });
                                            //send(result);
                                        }
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
                            process({ contactId: request.body.contactId, url: url }, function (err, result) {
                                console.log('error', err);
                                console.log('result', result);
                                if (err)
                                    send({ code: 1,  message: 'Error uploading contact photo' });
                                else {
                                    jimp.read(url).then(function (photo) {
                                        photo
                                            .resize(480, 319)            // resize
                                            .quality(80)                 // set JPEG quality
                                            .write(url + '_'); // save
                                    }).catch(function (err) {
                                        console.error(err);
                                    });

                                    jimp.read(url).then(function (photo) {
                                        photo
                                            .resize(320, 240)            // resize
                                            .quality(60)                 // set JPEG quality
                                            .write('/assets/images/users/' + request.body.contactId.toString() + '/thumbnail.jpg'); // save
                                        send(result);
                                    }).catch(function (err) {
                                        console.error(err);
                                    });
                                    //send(result);
                                }
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


        /*
        function send(result) {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(result));
        };
        */


    })
    .post('/uploadPhotoForModeration', function (request, response, next) {
        if (request.files.photo && request.body.userId) {
            let folderPath = path.resolve('/var/wwwn/phonebook/static/assets/images/moderation/');
            let photoPath = path.resolve(folderPath, request.files.photo.name);
            let queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getUserById)];
            let process = async.compose(...queue);
            console.log('path = ', folderPath);
            console.log('rbody', request.body);
            fs.exists(folderPath, () => {
                request.files.photo.mv(photoPath, function (err) {
                    if (err) {
                        console.log(err);
                        return response.status(500).send(err);
                    } else {
                        process({userId: request.body.userId}, function (err, result) {
                            console.log('error', err);
                            console.log('result', result);
                            if (err)
                                send({code: 1, message: 'Error uploading contact photo for moderation'});
                            else {
                                //console.log(result);

                                let transporter = nodemailer.createTransport({
                                    host: 'kolu-mail.nw.mrsksevzap.ru',
                                    port: 25,
                                    secure: false,
                                    tls: {
                                        rejectUnauthorized: false
                                    }
                                });

                                let mailOptions = {
                                    from: '"Телефонный справочник" <phonebook@kolenergo.ru>', // sender address
                                    to: 'savoronov@kolenergo.ru, aepirogov@kolenergo.ru', // list of receivers
                                    subject: 'Загружено фото абонента', // Subject line
                                    text: 'Test phonebook message', // plain text body
                                    html:
                                        '<b>' +
                                            result.surname + ' ' +
                                            result.name + ' ' +
                                            result.fname +
                                        '</b> загрузил фото.<br>' +
                                        '<small>' +
                                            '<i>фото во вложении к письму</i>' +
                                        '</small>', // html body,
                                    attachments: [
                                        {   // filename and content type is derived from path
                                            path: photoPath
                                        }
                                    ]
                                };


                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: %s', info.messageId);
                                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                    fs.unlinkSync(photoPath);
                                });

                                send(response, true);
                            }
                        });
                    }
                });
            });
        }

    })
    .listen(4444, function () {
        console.log('Server started at 4444');
    }).on('error', function(err){
        console.log('ON ERROR HANDLER');
        console.log(err);
    });






