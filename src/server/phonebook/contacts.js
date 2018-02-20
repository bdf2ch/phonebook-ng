"use strict";
const postgres = require('../common/postgres');
const express = require('express');


/**
 * Получение абонентов структурного подразделения
 * @param divisionId {Number} - Идентификатор структурного подразделения
 * @param sourceAtsId {Number} - Идентификатор исходной АТС
 * @param token {String} - Токен сессии пользователя
 */
function getContactsByDivisionId(divisionId, sourceAtsId, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT get_contacts_by_division_id($1, $2, $3)',
                values: [divisionId, sourceAtsId, token],
                func: 'get_contacts_by_division_id'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Получение абонентов структурного подразделения и всех нихлежащих
 * @param divisionId {Number} - Идентификатор структурного подразделения
 * @param sourceAtsId {Number} - Идентификатор исходной АТС
 * @param token {String} - Токен сессии пользователя
 */
function getContactsByDivisionIdRecursive(divisionId, sourceAtsId, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT get_contacts_by_division_id_recursive($1, $2, $3)',
                values: [divisionId, sourceAtsId, token],
                func: 'get_contacts_by_division_id_recursive'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Получение избранных абонентов
 * @param userId {Number} - Идентификатор пользователя
 * @param sourceAtsId {Number} - Идентификатор исходнйо АТС
 */
function getFavoriteContacts(userId, sourceAtsId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT get_favorite_contacts($1, $2)',
                values: [userId, sourceAtsId],
                func: 'get_favorite_contacts'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Поиск абонентов
 * @param query {String} - Строка поиска
 * @param sourceAtsId {Number} - Идентификатор исходной АТС
 * @param userId {Number} - Идентификатор пользователя
 */
function searchContacts(query, sourceAtsId, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT search_contacts($1, $2, $3)',
                values: [query, sourceAtsId, userId],
                func: 'search_contacts'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Добавление нового абонента
 * @param userId {Number} - Идентификатор пользователя
 * @param divisionId {Number} - Идентификатор структурного подразделения
 * @param surname {String} - Фамилия абонента
 * @param name {String} - Имя абонента
 * @param fname {String} - Отчество абонента
 * @param position {String} - Должность абонента
 * @param email {String} - E-mail абонента
 * @param mobile {String} - Мобильный телефон абонента
 */
function addContact(userId, divisionId, surname, name, fname, position, email, mobile) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT add_contact($1, $2, $3, $4, $5, $6, $7, $8)',
                values: [userId, divisionId, surname, name, fname, position, email, mobile],
                func: 'add_contact'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Изменение абоеннта
 * @param contactId {Number} - Идентификатор абонента
 * @param userId {Number} - Идентификатор пользователя
 * @param surname {String} - Фамилия абонента
 * @param name {String} - Имя абонента
 * @param fname {String} - Отчество абонента
 * @param position {String} - Должность абонента
 * @param email {String} - E-mail абонента
 * @param mobile {String} - Мобильный телефон абонента
 * @param officeId {Number} - Идентификатор офиса абонента
 * @param room {String} - Кабинет абонента
 * @param order {Number} - Порядок следования абонента
 * @param token {String} - Токен сессии пользователя
 */
function editContact(contactId, userId, surname, name, fname, position, email, mobile, officeId, room, order, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT edit_contact($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                values: [contactId, userId, surname, name, fname, position, email, mobile, officeId, room, order, token],
                func: 'edit_contact'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Удаление абонента
 * @param contactId {Number} - Идентификатор абонента
 */
function deleteContact(contactId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT delete_contact($1)',
                values: [contactId],
                func: 'delete_contact'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Добавление абоеннта в избранные
 * @param contactId {Number} - Идентификатор абонента
 * @param sourceAtsId {Number} - Идентификатор исходной АТС
 * @param token {String} - Токен сессии пользователя
 */
function addContactToFavorites(contactId, sourceAtsId, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT add_contact_to_favorites($1, $2, $3)',
                values: [contactId, sourceAtsId, token],
                func: 'add_contact_to_favorites'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Удаление абонента из избранных
 * @param contactId {Number} - Идентификатор абонента
 * @param token {String} - Токен сессии пользователя
 */
function removeContactFromFavorites(contactId, token) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT delete_contact_from_favorites($1, $2)',
                values: [contactId, token],
                func: 'delete_contact_from_favorites'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Добавление фотографии абонента
 * @param contactId {Number} - Идентификатор абонента
 * @param url {String} - URL фотографии абонента
 */
function addContactPhoto(contactId, url) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT add_user_photo($1, $2)',
                values: [contactId, url],
                func: 'add_user_photo'
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Изменение структурного подразделение абонента
 * @param contactId {Number} - Идентификатор абонента
 * @param divisionId {Number} - Идентификатор структурного подразделения
 * @param sourceAtsId {Number} - Идентификатор исходной АТС
 */
function setContactDivision(contactId, divisionId, sourceAtsId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await postgres.query({
                text: 'SELECT set_contact_division($1, $2, $3)',
                values: [contactId, divisionId, sourceAtsId],
                func: 'set_contact_division'
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
            case 'getDyDivisionId':
                result = await getContactsByDivisionId(
                    req.body.data.divisionId,   // Идентификатор структурного подразделения
                    req.body.data.sourceAtsId,  // Идентификатор исходнеой АТС
                    req.body.data.token         // Токен сессии пользователя
                );
                break;
            case 'getByDivisionIdRecursive':
                result = await getContactsByDivisionIdRecursive(
                    req.body.data.divisionId,   // Идентификатор структурного подразделения
                    req.body.data.sourceAtsId,  // Идентификатор исходной АТС
                    req.body.data.token         // Токен сессии пользователя
                );
                break;
            case 'getFavorites':
                result = await getFavoriteContacts(
                    req.body.data.userId,       // Идентификатор пользователя
                    req.body.data.sourceAtsId   // Идентификатор исходнйо АТС
                );
                break;
            case 'search':
                result = await searchContacts(
                    req.body.data.search,       // Строка поиска
                    req.body.data.sourceAtsId,  // Идентификатор исходнйо АТС
                    req.body.data.userId        // Идентификатор пользователя
                );
                break;
            case 'add':
                result = await addContact(
                    req.body.data.userId,       // Идентификатор пользователя
                    req.body.data.divisionId,   // Идентификатор структурного подразделения
                    req.body.data.surname,      // Фамилия абонента
                    req.body.data.name,         // Имя абонента
                    req.body.data.fname,        // Отчество абонента
                    req.body.data.position,     // Должность абонента
                    req.body.data.email,        // E-mail абонента
                    req.body.data.mobile        // Мобильный телефон абонента
                );
                break;
            case 'edit':
                result = await editContact(
                    req.body.data.contactId,    // Идентификатор абонента
                    req.body.data.userId,       // Идентификатор пользователя
                    req.body.data.surname,      // Фамилия абонента
                    req.body.data.name,         // Имя абонента
                    req.body.data.fname,        // Отчечтво абонента
                    req.body.data.position,     // Должность абонента
                    req.body.data.email,        // E-mail абонента
                    req.body.data.mobile,       // Мобильный телефон абонента
                    req.body.data.officeId,     // Идентификатор офиса абонента
                    req.body.data.room,         // Кабинет абонента
                    req.body.data.order,        // Порядок следования абоеннта
                    req.body.data.token         // Токен сессии пользователя
                );
                break;
            case 'delete':
                result = await deleteContact(
                    req.body.data.contactId     // Идентификатор абонента
                );
                break;
            case 'addToFavorites':
                result = await addContactToFavorites(
                    req.body.data.contactId,    // Идентификатор абонента
                    req.body.data.sourceAtsId,  // Идентификатор исходной АТС
                    req.body.data.token         // Токен сессии пользователя
                );
                break;
            case 'removeFromFavorites':
                result = await removeContactFromFavorites(
                    req.body.data.contactId,    // Идентификатор абонента
                    req.body.data.token         // Токен сессии пользователя
                );
                break;
            case 'setDivision':
                result = await setContactDivision(
                    req.body.data.contactId,        // Идентификатор абонента
                    req.body.data.divisionId,       // Идентификатор структурного подразделения
                    req.body.data.sourceAtsId       // Идентификатор исходной АТС
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
    getByDivisionId: getContactsByDivisionId,
    getByDivisionIdRecursive: getContactsByDivisionIdRecursive,
    getFavorites: getFavoriteContacts,
    search: searchContacts,
    add: addContact,
    edit: editContact,
    delete: deleteContact,
    addToFavorites: addContactToFavorites,
    removeFromFavorites: removeContactFromFavorites,
    addPhoto: addContactPhoto,
    setDivision: setContactDivision
};