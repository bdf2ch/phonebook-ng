"use strict";
const express = require('express');
const postgres = require('../common/postgres');
const ldap = require('../common/ldap');
const session = require('../common/session');


/**
 * Получение данных для инициализации
 */
function getInitialData() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT get_phonebook_initial_data()',
                values: [],
                func: 'get_phonebook_initial_data'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


let router = express.Router();
router.post('/', async (req, res) => {
    let result = null;
    try {
        switch (req.body.action) {
            case 'getInitialData':
                result = await getInitialData();
                break;
            case 'getSession':
                result = await session.getByToken(
                    req.body.data.token     // Токен сессии пользователя
                );
                break;
            case 'logIn':
                result = await ldap.logIn(
                    req.body.data.account,  // Учетная запись пользователя
                    req.body.data.password  // Пароль пользователя
                );
                break;
            case 'logOut':
                result = await session.end(
                    req.body.data.token,    // Токен сессии пользователя
                    res                     // Ответ сервера
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
    routes: router
};