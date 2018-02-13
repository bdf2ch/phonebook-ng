"use strict";
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const jimp = require('jimp');
const phoneBook = require('./api');
const contacts = require('./contacts');
const users = require('../common/users');
const utilities = require('../common/utilities');


module.exports = {
    uploadContactPhotoForModeration: (userId, photo) => {
        return new Promise(async (resolve, reject) => {
            if (userId && photo) {
                let folderPath = path.resolve('/var/wwwn/phonebook/static/assets/images/moderation/');
                let photoPath = path.resolve(folderPath, photo.name);
                console.log('path = ', folderPath);
                //console.log('rbody', request.body);
                let isFolderExists = await utilities.isFolderExists(folderPath);
                if (isFolderExists) {
                    console.log('temp folder exists');
                    photo.mv(photoPath, async (err) => {
                        if (err) {
                            console.log(err);
                            reject({message: 'Error uploading contact photo for moderation', description: err});
                        } else {
                            let result = await users.getById(userId);

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
                        }
                    });
                }
            } else {
                reject({message: 'No photo sent or no contact id specified'});
            }
        });
    },


    uploadContactPhoto: (contactId, photo) => {
        return new Promise(async (resolve, reject) => {
            if (photo && contactId) {
                let folderPath = path.resolve('/var/wwwn/phonebook/static/assets/images/users/', contactId.toString());
                let photoPath = path.resolve(folderPath, photo.name);
                let url = '/assets/images/users/' + contactId.toString() + '/' + photo.name;
                console.log('folder path = ', folderPath);

                let isFolderExists = await utilities.isFolderExists(folderPath);
                if (isFolderExists) {
                    photo.mv(photoPath, async function (err) {
                        if (err) {
                            reject({message: 'Error uploading contact photo', description: err});
                        } else {
                            let result = await contacts.addPhoto(contactId, url);
                            jimp.read(photoPath).then((photo) => {
                                photo
                                    .resize(320, 240)
                                    .quality(60)
                                    .write(`/var/wwwn/phonebook/static/assets/images/users/${contactId.toString()}/thumbnail.jpg`);
                                resolve(result);
                            }).catch(function (err) {
                                console.error(err);
                            });
                        }
                    });
                } else {
                    const isFolderCreated = await utilities.createFolder(folderPath);
                    if (isFolderCreated) {
                        photo.mv(photoPath, async function (err) {
                            if (err) {
                                reject({message: 'Error uploading contact photo', description: err});
                            } else {
                                let result = await contacts.addPhoto(contactId, url);
                                jimp.read(photoPath).then((photo) => {
                                    photo
                                        .resize(320, 240)
                                        .quality(60)
                                        .write(`/var/wwwn/phonebook/static/assets/images/users/${contactId.toString()}/thumbnail.jpg`);
                                    resolve(result);
                                }).catch(function (err) {
                                    console.error(err);
                                    reject({message: 'Error uploading contact photo', description: err});
                                });
                            }
                        });
                    }
                }
            }
        });
    }
};