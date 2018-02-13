"use strict";
const postgres = require('../common/postgres');
const express = require('express');


/**
 * Добавление нового структурного подразделения
 * @param parentId {Number} - Идентификатор родительског оструктурного подразделения
 * @param title {String} - Наименование структурного подразделения
 */
function addDivision(parentId, title) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT add_phonebook_division($1, $2)',
                values: [parentId, title],
                func: 'add_phonebook_division'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Изменение структурного подразделения
 * @param divisionId {Number} - Идентификатор структурного подразделения
 * @param parentId {Number} - Идентификатор родительского структурного подразделения
 * @param officeId {Number} - Идентификатор офиса организации
 * @param title {String} - Наименование структурного подразделения
 */
function editDivision(divisionId, parentId, officeId, title) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT edit_phonebook_division($1, $2, $3, $4)',
                values: [divisionId, parentId, officeId, title],
                func: 'edit_phonebook_division'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Удаление структурного подразделения
 * @param divisionId {Number} - Идентификатор структурного подразделения
 * @param token {String} - Токен сессии пользователя
 */
function deleteDivision (divisionId, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT delete_phonebook_division($1, $2)',
                values: [divisionId, token],
                func: 'delete_phonebook_division'
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
            case 'add':
                result = await addDivision(
                    req.body.data.parentId,         // Идентфикатор родительского структурного подразделения
                    req.body.data.title             // Наименование структурного подразделения
                );
                break;
            case 'edit':
                result = await editDivision(
                    req.body.data.id,               // Идентификатор структурного подразделения
                    req.body.data.parentId,         // Идентификатор родительского струкктурного подразделения
                    req.body.data.officeId,         // Идентификатор офиса
                    req.body.data.title             // Наименование структкрного подразделения
                );
                break;
            case 'delete':
                result = await deleteDivision(
                    req.body.data.divisionId,       // Идентификатор структурного подразделения
                    req.body.data.token             // Токен сессии пользователя
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
    add: addDivision,
    edit: editDivision,
    delete: deleteDivision
};