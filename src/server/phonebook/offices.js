"use strict";
const express = require('express');
const postgres = require('../common/postgres');


/**
 * Добавление офиса организации
 * @param organizationId {Number} - Идентификатор организации
 * @param address {String} - Адрес офиса
 */
function addOffice (organizationId, address) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT add_office($1, $2)',
                values: [organizationId, address],
                func: 'add_office'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Изменение офиса организации
 * @param officeId {Number} - Идентификатор офиса организации
 * @param address {String} - Адрес офиса организации
 */
function editOffice (officeId, address) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT edit_office($1, $2)',
                values: [officeId, address],
                func: 'edit_office'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Удаление офиса организации
 * @param officeId {Number} - идентификатор офиса организации
 */
function deleteOffice (officeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT delete_office($1)',
                values: [officeId],
                func: 'delete_office'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}


let router = express.Router();
router.post('/', async(req, res) => {
    let result = null;
    try {
        switch (req.body.action) {
            case 'add':
                result = await addOffice(
                    req.body.data.organizationId,   // Идентификатор организации
                    req.body.data.address           // Адрес офиса
                );
                break;
            case 'edit':
                result = await editOffice(
                    req.body.data.officeId,         // Идентификатор офиса
                    req.body.data.address           // Адрес офиса
                );
                break;
            case 'delete':
                result = await deleteOffice(
                    req.body.data.officeId          // Идентфификатор офиса
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
    add: addOffice,
    edit: editOffice,
    delete: deleteOffice
};