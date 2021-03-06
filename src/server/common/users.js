"use strict";
const postgres = require('./postgres');
const express = require('express');


/**
 * Получение пользователя по идентификатору
 * @param userId {Number} - идентификатор пользователя
 */
function getUserById(userId) {
    return new Promise(async (resolve, reject) => {
        console.log('fetching user');
        try {
            let user = await postgres.query({
                text: 'SELECT get_user_by_id($1)',
                values: [userId],
                func: 'get_user_by_id'
            });
            resolve(user);
        } catch (err) {
            reject(err);
        }
    });
}


/**
 * Поиск пользователей
 * @param query {String} - строка поиска
 */
function searchUsers(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT search_users($1)',
                values: [query],
                func: 'search_users'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}


/**
 * Изменение местоположения пользователя
 * @param userId {Number} - Идентификатор пользователя
 * @param officeId {Number} - Идентификатор офиса
 * @param room {String} - Кабинет пользователя
 * @param token {String} - Токен сессии пользователя
 */
function setUserLocation(userId, officeId, room, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT set_user_location($1, $2, $3, $4)',
                values: [userId, officeId, room, token],
                func: 'set_user_location'
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
            case 'getById':
                result = await getUserById(
                    req.body.data.userId                  // Идентификатор пользователя
                );
                break;
            case 'search':
                result = await searchUsers(
                    req.body.data.query                   // Строка поиска
                );
                break;
            case 'setLocation':
                result = await setUserLocation(
                    req.body.data.userId,                 // Идентификатор пользователя
                    req.body.data.officeId,     // Идентификатор офиса организации
                    req.body.data.room,                   // Кабинет пользователя
                    req.body.data.token                   // Токен сессии пользователя
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
    getById: getUserById,
    search: searchUsers
};