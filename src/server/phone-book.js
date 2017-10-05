module.exports = {
    /**
     * Получение инициализационный данных
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: Array, func: string}}
     */
    getInitialData: function (parameters) {
        return {
            text: 'SELECT get_phonebook_initial_data()',
            values: [],
            func: 'get_phonebook_initial_data'
        }
    },


    /**
     * Получение информации о сессии
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    getSession: function (parameters) {
        return {
            text: 'SELECT get_session_by_token($1)',
            values: [parameters.data.token],
            func: 'get_session_by_token'
        }
    },


    /**
     * Завершение сессии текущего пользователя
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    logOut: function (parameters) {
        return {
            text: 'SELECT log_out_user($1)',
            values: [parameters.data.token],
            func: 'log_out_user'
        }
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
     * Получение абонентов по структкрному подразделению
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    getContactsByDivisionId: function (parameters) {
        return {
            text: 'SELECT get_contacts_by_division_id($1, $2, $3)',
            values: [parameters.data.divisionId, parameters.data.sourceAtsId, parameters.data.token],
            func: 'get_contacts_by_division_id'
        }
    },


    /**
     * Получение избранных абонентов
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    getFavoriteContacts: function (parameters) {
        return {
            text: 'SELECT get_favorite_contacts($1, $2)',
            values: [parameters.data.userId, parameters.data.sourceAtsId],
            func: 'get_favorite_contacts'
        }
    },


    /**
     * Поиск абонентов
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    searchContacts: function (parameters) {
        return {
            text: 'SELECT search_contacts($1, $2, $3)',
            values: [parameters.data.search, parameters.data.sourceAtsId, parameters.data.userId],
            func: 'search_contacts'
        }
    },


    /**
     * Изменение данных абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: Array, func: string}}
     */
    editContact: function (parameters) {
        return {
            text: 'SELECT edit_contact($1, $2, $3, $4, $5, $6, $7)',
            values: [
                parameters.data.contactId,
                parameters.data.surname,
                parameters.data.name,
                parameters.data.fname,
                parameters.data.position,
                parameters.data.email,
                parameters.data.mobile
            ],
            func: 'edit_contact'
        }
    },


    /**
     * Добавление абонента в избранные
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*], func: string}}
     */
    addContactToFavorites: function (parameters) {
        return {
            text: 'SELECT add_contact_to_favorites($1, $2)',
            values: [parameters.data.contactId, parameters.data.token],
            func: 'add_contact_to_favorites'
        }
    },


    /**
     * Удаление абонента из избранных
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*], func: string}}
     */
    removeContactFromFavorites: function (parameters) {
        return {
            text: 'SELECT delete_contact_from_favorites($1, $2)',
            values: [parameters.data.contactId, parameters.data.token],
            func: 'delete_contact_from_favorites'
        }
    },


    /**
     * Добавление фото абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*], func: string}}
     */
    addContactPhoto: function (parameters) {
        return {
            text: 'SELECT add_user_photo($1, $2)',
            values: [parameters.contactId, parameters.url],
            func: 'add_user_photo'
        }
    },


    /**
     * Перемещение абонента в структурное подразделение с заданным идентификатором
     * @param parameters
     * @returns {{text: string, values: [*,*], func: string}}
     */
    setContactDivision: function (parameters) {
        return {
            text: 'SELECT set_contact_division($1, $2, $3)',
            values: [parameters.data.contactId, parameters.data.divisionId, parameters.data.sourceAtsId],
            func: 'set_contact_division'
        }
    },


    /**
     * Добавление телефона абоненту
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [null,null,null], func: string}}
     */
    addContactPhone: function (parameters) {
        return {
            text: 'SELECT add_contact_phone($1, $2, $3)',
            values: [parameters.data.contactId, parameters.data.atsId, parameters.data.number],
            func: 'add_contact_phone'
        }
    },


    /**
     * Изменение телефона абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*,*,*], func: string}}
     */
    editContactPhone: function (parameters) {
        return {
            text: 'SELECT edit_contact_phone($1, $2, $3)',
            values: [parameters.data.phoneId, parameters.data.atsId, parameters.data.number],
            func: 'edit_contact_phone'
        }
    },


    /**
     * Удаление телефона абонента
     * @param parameters {Object} - параметры запроса
     * @returns {{text: string, values: [*], func: string}}
     */
    deleteContactPhone: function (parameters) {
        return {
            text: 'SELECT delete_contact_phone($1)',
            values: [parameters.data.phoneId],
            func: 'delete_contact_phone'
        }
    }
};
