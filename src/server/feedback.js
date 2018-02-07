"use strict";
const nodemailer = require('nodemailer');
const users = require('./users');


module.exports = {
    phoneBook: {
        send: (parameters) => {
            console.log('paramz', parameters.data);
            return new Promise(async (resolve, reject) => {
                if (parameters.data.userId) {
                    console.log('waiting for user');
                    let user = await users.getUserById(parameters.data.userId);
                    console.log('user', user);
                    if (user) {
                        let theme = '';
                        switch (parameters.data.message.themeId) {
                            case 1: theme = 'ошибка в работе справочника'; break;
                            case 2: theme = 'несоответствие данных в справочнике'; break;
                            case 2: theme = 'замечания и пожелания'; break;
                        };

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
                            to: 'savoronov@kolenergo.ru',
                            subject: `Отправлено сообщение (${theme})`,
                            html: `<b>${user.name} ${user.fname} ${user.surname}</b> отправил сообщение.<br>
                           Тема сообщения: ${theme}<br>
                           Текст сообщения: ${parameters.data.message.message}`
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                //reject(error);
                                resolve(false);
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                            resolve(true);
                        });
                    } else {
                        resolve(false);
                    }
                } else {
                    //resolve(false);
                    reject({error: 'User id not specified', description: 'User id parameter not specified'});
                }
            });
        }
    }
};