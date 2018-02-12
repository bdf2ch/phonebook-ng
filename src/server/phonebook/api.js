"use strict";
const postgres = require('../common/postgres');
const session = require('../common/session');


module.exports = {

    /**
     * Получение данных для инициализации
     */
    getInitialData: () => {
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
    },

    /**
     * Получение информации о сессии
     * @param token {String} - токен сессии пользователя
     */
    getSession: (token) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await postgres.query({
                    text: 'SELECT get_session_by_token($1)',
                    values: [token],
                    func: 'get_session_by_token'
                });
                resolve(result);
            } catch (error) {
                reject(error);
            };
        });
    },

    /**
     * Завершение сессии текущего пользователя
     * @param token {String} - Токен сессии пользователя
     * @param response {Object} - Ответ сервера
     */
    logOut: (token, response) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await postgres.query({
                    text: 'SELECT log_out_user($1)',
                    values: [token],
                    func: 'log_out_user'
                });
                session.remove(response);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },


    /**
     * Получение списка структурных подразделений
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: Array, func: string}}
     */
    getDivisionList: function (parameters) {
       return {
            text: 'SELECT get_phonebook_divisions()',
            values: [],
            func: 'get_phonebook_divisions'
        };
    },


    /**
     * Получение абонентов по структкрному подразделению, рекурсивно
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    /*
    getContactsByDivisionIdRecursive: function (parameters) {
        return {
            text: 'SELECT get_contacts_by_division_id_recursive($1, $2, $3)',
            values: [parameters.data.divisionId, parameters.data.sourceAtsId, parameters.data.token],
            func: 'get_contacts_by_division_id_recursive'
        }
    },
    */


    getContactsByDivisionId_: (divisionId, sourceAtsId, token) => {
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
    },


    /**
     * Получение абонентов по структкрному подразделению
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    /*
    getContactsByDivisionId: function (parameters) {
        return {
            text: 'SELECT get_contacts_by_division_id($1, $2, $3)',
            values: [parameters.data.divisionId, parameters.data.sourceAtsId, parameters.data.token],
            func: 'get_contacts_by_division_id'
        }
    },
    */


    getContactsByDivisionId: (divisionId, sourceAtsId, token) => {
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
    },


    /**
     * Получение избранных абонентов
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    /*
    getFavoriteContacts: function (parameters) {
        return {
            text: 'SELECT get_favorite_contacts($1, $2)',
            values: [parameters.data.userId, parameters.data.sourceAtsId],
            func: 'get_favorite_contacts'
        }
    },
    */

    getFavoriteContacts: (userId, sourceAtsId) => {
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
    },


    /**
     * Поиск абонентов
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    /*
    searchContacts: function (parameters) {
        return {
            text: 'SELECT search_contacts($1, $2, $3)',
            values: [parameters.data.search, parameters.data.sourceAtsId, parameters.data.userId],
            func: 'search_contacts'
        }
    },
    */

    searchContacts: (query, sourceAtsId, userId) => {
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
    },


    /**
     * Добавление нового абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*,*,*,*,*,*,*], func: string}}
     */
    /*
    addContact: function (parameters) {
        return {
            text: 'SELECT add_contact($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [
                parameters.data.userId,
                parameters.data.divisionId,
                parameters.data.surname,
                parameters.data.name,
                parameters.data.fname,
                parameters.data.position,
                parameters.data.email,
                parameters.data.mobile
            ],
            func: 'add_contact'
        }
    },
    */


    addContact: (userId, divisionId, surname, name, fname, position, email, mobile) => {
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
    },


    /**
     * Изменение данных абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: Array, func: string}}
     */
    /*
    editContact: function (parameters) {
        return {
            text: 'SELECT edit_contact($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            values: [
                parameters.data.contactId,
                parameters.data.userId,
                parameters.data.surname,
                parameters.data.name,
                parameters.data.fname,
                parameters.data.position,
                parameters.data.email,
                parameters.data.mobile,
                parameters.data.officeId,
                parameters.data.room
            ],
            func: 'edit_contact'
        }
    },
    */

    editContact: (contactId, userId, surname, name, fname, position, email, mobile, officeId, room) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await postgres.query({
                    text: 'SELECT edit_contact($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    values: [contactId, userId, surname, name, fname, position, email, mobile, officeId, room],
                    func: 'edit_contact'
                });
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },


    /**
     * Удаление абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: *[], func: string}}
     */
    /*
    deleteContact: (parameters) => {
        return {
            text: 'SELECT delete_contact($1)',
            values: [parameters.data.contactId],
            func: 'delete_contact'
        }
    },
    */


    deleteContact: (contactId) => {
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
    },


    /**
     * Добавление абонента в избранные
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*], func: string}}
     */
    addContactToFavorites: (contactId, sourceAtsId, token) => {
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
    },


    /**
     * Удаление абонента из избранных
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*], func: string}}
     */
    /*
    removeContactFromFavorites: function (parameters) {
        return {
            text: 'SELECT delete_contact_from_favorites($1, $2)',
            values: [parameters.data.contactId, parameters.data.token],
            func: 'delete_contact_from_favorites'
        }
    },
    */

    removeContactFromFavorites: (contactId, token) => {
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
    },


    /**
     * Добавление фото абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*], func: string}}
     */
    /*
    addContactPhoto: function (parameters) {
        return {
            text: 'SELECT add_user_photo($1, $2)',
            values: [parameters.contactId, parameters.url],
            func: 'add_user_photo'
        }
    },
    */


    addContactPhoto: (contactId, url) => {
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
    },


    /**
     * Изменение позиции фото абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*,*], func: string}}
     */
    setContactPhotoPosition: function (parameters) {
        return {
            text: 'SELECT set_contact_photo_position($1, $2, $3, $4)',
            values: [parameters.data.contactId, parameters.data.top, parameters.data.left, parameters.data.zoom],
            func: 'set_contact_photo_position'
        }
    },


    /**
     * Перемещение абонента в структурное подразделение с заданным идентификатором
     * @param parameters
     * @returns {{text: string, values: [*,*], func: string}}
     */
    /*
    setContactDivision: function (parameters) {
        return {
            text: 'SELECT set_contact_division($1, $2, $3)',
            values: [parameters.data.contactId, parameters.data.divisionId, parameters.data.sourceAtsId],
            func: 'set_contact_division'
        }
    },
    */

    setContactDivision: (contactId, divisionId, sourceAtsId) => {
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
    },


    /**
     * Добавление телефона абоненту
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [number,number,string,number], func: string}}
     */
    /*
    addContactPhone: function (parameters) {
        return {
            text: 'SELECT add_contact_phone($1, $2, $3, $4)',
            values: [parameters.data.contactId, parameters.data.atsId, parameters.data.number, parameters.data.sourceAtsId],
            func: 'add_contact_phone'
        }
    },
    */

    addContactPhone: (contactId, atsId, number, sourceAtsId) => {
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
    },


    /**
     * Изменение телефона абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*,*], func: string}}
     */
    /*
    editContactPhone: function (parameters) {
        return {
            text: 'SELECT edit_contact_phone($1, $2, $3)',
            values: [parameters.data.phoneId, parameters.data.atsId, parameters.data.number],
            func: 'edit_contact_phone'
        }
    },
    */


    editContactPhone: (phoneId, atsId, number) => {
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
    },


    /**
     * Удаление телефона абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    /*
    deleteContactPhone: function (parameters) {
        return {
            text: 'SELECT delete_contact_phone($1)',
            values: [parameters.data.phoneId],
            func: 'delete_contact_phone'
        }
    },
    */

    deleteContactPhone: (phoneId) => {
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
    },


    /**
     * Добавление нового структурного подразделения
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*,*], func: string}}
     */
    /*
    addDivision: function (parameters) {
        return {
            text: 'SELECT add_phonebook_division($1, $2)',
            values: [parameters.data.parentId, parameters.data.title],
            func: 'add_phonebook_division'
        }
    },
    */


    addDivision: (parentId, title) => {
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
    },


    /**
     * Изменение структурного подразделения
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*,*,*], func: string}}
     */
    /*
    editDivision: function (parameters) {
        return {
            text: 'SELECT edit_phonebook_division($1, $2, $3, $4)',
            values: [parameters.data.id, parameters.data.parentId, parameters.data.officeId, parameters.data.title],
            func: 'edit_phonebook_division'
        }
    },
    */


    editDivision: (divisionId, parentId, officeId, title) => {
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
    },


    /**
     * Удаление структурного подразделения
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: *[], func: string}}
     */
    /*
    deleteDivision: function (parameters) {
        return {
            text: 'SELECT delete_phonebook_division($1, $2)',
            values: [parameters.data.divisionId, parameters.data.token],
            func: 'delete_phonebook_division'
        }
    },
    */


    deleteDivision: (divisionId, token) => {
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
    },


    /**
     * Добавление нового офиса организации
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: *[], func: string}}
     */
    /*
    addOffice: function (parameters) {
        return {
            text: 'SELECT add_office($1, $2)',
            values: [parameters.data.organizationId, parameters.data.address],
            func: 'add_office'
        }
    },
    */


    addOffice: (organizationId, address) => {
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
    },

    /**
     * Изменение офиса организации
     * @param officeId {Number} - идентификатор офиса
     * @param address {String} - адрес офиса
     */
    editOffice: (officeId, address) => {
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
    },

    /**
     * Удаление офиса организации
     * @param officeId {Number} - идентификатор офиса
     */
    deleteOffice: (officeId) => {
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
    },


    /**
     * Поиск пользователей
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    /*
    searchUsers: function (parameters) {
        return {
            text: 'SELECT search_users($1)',
            values: [parameters.data.query],
            func: 'search_users'
        }
    },
    */


    searchUsers: (query) => {
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
    },

    /**
     * Получение информации о пользователе
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: *[], func: string}}
     */
    getUserById: function (parameters) {
        return {
            text: 'SELECT get_user_by_id($1)',
            values: [parameters.userId],
            func: 'get_user_by_id'
        }
    },


    feedback: function (parameters) {
        return new Promise((resolve, reject) => {

        });
    }
};
