"use strict";
const postgres = require('../common/postgres');
const express = require('express');


/**
 * Добавление контактного телефона
 * @param contactId {Number} - Идентификатор абонента
 * @param atsId {Number} - Идентификатор АТС
 * @param number {String} - Номер телефона
 * @param sourceAtsId {Number} - Идентфификатор исходной АТС
 */
function addContactPhone(contactId, atsId, number, sourceAtsId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT add_contact_phone($1, $2, $3, $4)',
                values: [contactId, atsId, number, sourceAtsId],
                func: 'add_contact_phone'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Изменение контактного телефона
 * @param phoneId {Number} - Идентификатор контактного телефона
 * @param atsId {Number} - Идентификатор АТС
 * @param number {String} - Номер телефона
 */
function editContactPhone(phoneId, atsId, number) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT edit_contact_phone($1, $2, $3)',
                values: [phoneId, atsId, number],
                func: 'edit_contact_phone'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Удаление контактного телефона
 * @param phoneId {Number} - Идентификатор контактного телефона
 */
function deleteContactPhone(phoneId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT delete_contact_phone($1)',
                values: [phoneId],
                func: 'delete_contact_phone'
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
                result = await addContactPhone(
                    req.body.data.contactId,    // Идентификатор абонента
                    req.body.data.atsId,        // Идентификатор АТС
                    req.body.data.number,       // Номер телефона
                    req.body.data.sourceAtsId   // Идентификатор исходной АТС
                );
                break;
            case 'edit':
                result = await editContactPhone(
                    req.body.data.phoneId,      // Идентфикатор телефона
                    req.body.data.atsId,        // Идентификатор АТС
                    req.body.data.number        // Номер телефона
                );
                break;
            case 'delete':
                result = await deleteContactPhone(
                    req.body.data.phoneId           // Идентификатор телефона
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
    add: addContactPhone,
    edit: editContactPhone,
    delete: deleteContactPhone
};