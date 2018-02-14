"use strict";
const express = require('express');
const nodemailer = require('nodemailer');
const users = require('../common/users');


function sendFeedback(userId, message) {
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


let router = express.Router();
router.post('/', async (req, res) => {
    let result = null;
    try {
        switch (req.body.action) {
            case 'send':
                result = await sendFeedback(
                    req.body.data.userId,           // Идентфикатор пользователя
                    req.body.data.message           // Сообщение
                );
                break;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(result));
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


module.exports = {
    routes: router,
    send: sendFeedback
};