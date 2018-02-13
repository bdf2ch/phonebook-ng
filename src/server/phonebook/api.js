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


    feedback: function (parameters) {
        return new Promise((resolve, reject) => {

        });
    }
};
