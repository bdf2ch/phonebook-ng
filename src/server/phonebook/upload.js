"use strict";
const fs = require('fs');
const path = require('path');
const async = require('async');
const nodemailer = require('nodemailer');
const jimp = require('jimp');
const postgres = require('../common/postgres');
const phoneBook = require('./api');
const utilities = require('../common/utilities');


module.exports = {
    uploadContactPhotoForModeration: (request) => {
        return new Promise(async (resolve, reject) => {
            if (request.files.photo && request.body.userId) {
                let folderPath = path.resolve('/var/wwwn/phonebook/static/assets/images/moderation/');
                let photoPath = path.resolve(folderPath, request.files.photo.name);
                let queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getUserById)];
                console.log('path = ', folderPath);
                console.log('rbody', request.body);
                let isFolderExists = await utilities.isFolderExists(folderPath);
                if (isFolderExists) {
                    console.log('temp folder exists');
                    request.files.photo.mv(photoPath, (err) => {
                        if (err) {
                            console.log(err);
                            reject({message: 'Error uploading contact photo for moderation', description: err});
                            //return response.status(500).send(err);
                        } else {
                            var process = async.compose(...queue);
                            process({userId: request.body.userId}, function (err, result) {
                                console.log('result', result);
                                if (err)
                                //sendFunc({ message: 'Error uploading contact photo for moderation', description: err });
                                    reject({message: 'Error uploading contact photo for moderation', description: err});
                                else {
                                    let transporter = nodemailer.createTransport({
                                        host: 'kolu-mail.nw.mrsksevzap.ru',
                                        port: 25,
                                        secure: false,
                                        tls: {
                                            rejectUnauthorized: false
                                        }
                                    });

                                    let mailOptions = {
                                        from: '"Телефонный справочник" <phonebook@kolenergo.ru>',
                                        to: 'savoronov@kolenergo.ru, aepirogov@kolenergo.ru',
                                        subject: 'Загружено фото абонента',
                                        html:
                                            `<b>${result.name} ${result.fname} ${result.surname}</b> загрузил фото<br>
                                            <small><i>фото во вложении к письму</i></small>`,
                                        attachments: [
                                            {
                                                path: photoPath
                                            }
                                        ]
                                    };

                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message sent: %s', info.messageId);
                                        fs.unlinkSync(photoPath);
                                        resolve(true);
                                    });

                                    //sendFunc(response, true);
                                }
                            });
                        }
                    });
                }
            } else {
                reject({message: 'No photo sended or no contact id specified'});
            }
        });
    },


    uploadContactPhoto: (request, response, sendFunc) => {
        if (request.files.photo && request.body.contactId) {
            let folderPath = path.resolve('/var/wwwn/phonebook/static/assets/images/users/', request.body.contactId.toString());
            let photoPath = path.resolve(folderPath, request.files.photo.name);
            let url = '/assets/images/users/' + request.body.contactId.toString() + '/' + request.files.photo.name;
            let fileNameArray = request.files.photo.name.split('.');
            let extension = fileNameArray[fileNameArray.length - 1];

            let queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactPhoto)];
            let process = async.compose(...queue);
            console.log('folder path = ', folderPath);
            console.log('rbody', request.body);

            fs.exists(folderPath, async (exists) => {
                if (exists) {
                    request.files.photo.mv(photoPath, function (err) {
                        if (err) {
                            return response.status(500).send(err);
                        } else {
                            process({contactId: request.body.contactId, url: url}, function (err, result) {
                                console.log('error', err);
                                console.log('result', result);
                                if (err) {
                                    sendFunc(response, {
                                        code: 1,
                                        message: 'Error uploading contact photo',
                                        description: err
                                    });
                                } else {
                                    jimp.read(photoPath).then((photo) => {
                                        photo
                                            .resize(320, 240)
                                            .quality(60)
                                            .write(`/var/wwwn/phonebook/static/assets/images/users/${request.body.contactId.toString()}/thumbnail.jpg`);
                                        sendFunc(response, result);
                                    }).catch(function (err) {
                                        console.error(err);
                                    });
                                }
                            });
                        }
                    });
                } else {
                    const isFolderCreated = await utilities.createFolder(folderPath);
                    if (isFolderCreated) {
                        request.files.photo.mv(photoPath, function (err) {
                            if (err) {
                                return response.status(500).send(err);
                            } else {
                                process({contactId: request.body.contactId, url: url}, function (err, result) {
                                    console.log('error', err);
                                    console.log('result', result);
                                    if (err) {
                                        sendFunc(response, result, {
                                            code: 1,
                                            message: 'Error uploading contact photo',
                                            description: err
                                        });
                                    } else {
                                        jimp.read(photoPath).then((photo) => {
                                            photo
                                                .resize(320, 240)
                                                .quality(60)
                                                .write(`/var/wwwn/phonebook/static/assets/images/users/${request.body.contactId.toString()}/thumbnail.jpg`);
                                            sendFunc(response, result);
                                        }).catch(function (err) {
                                            console.error(err);
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
};