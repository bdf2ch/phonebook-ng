"use strict";
const nodemailer = require('nodemailer');
const users = require('../common/users');


module.exports = {
    send: (userId, message) => {
        return new Promise(async (resolve, reject) => {
            if (userId) {
                try {
                    let user = await users.getById(userId);
                    if (user) {
                        let theme = '';
                        switch (parseInt(message['themeId'])) {
                            case 1:
                                theme = 'ошибка в работе справочника';
                                break;
                            case 2:
                                theme = 'несоответствие данных в справочнике';
                                break;
                            case 3:
                                theme = 'замечания и предложения';
                                break;
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
                            subject: `Отправлено сообщение (${theme}).`,
                            html: `<b>${user.name} ${user.fname} ${user.surname}</b> отправил сообщение.<br>
                                       Тема сообщения: ${theme}<br>
                                       Текст сообщения: ${message['message']}`
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
                } catch (err) {
                    reject(err);
                }
            } else {
                //resolve(false);
                reject({error: 'User id not specified', description: 'User id parameter not specified'});
            }
        });
    }
};