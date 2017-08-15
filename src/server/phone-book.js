module.exports = {
    /**
     * Получение инициализационный данных
     * @param parameters
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
     * @param parameters
     * @returns {{text: string, values: [*], func: string}}
     */
    getSession: function (parameters) {
        return {
            text: 'SELECT get_session_by_token($1)',
            values: [parameters.token],
            func: 'get_session_by_token'
        }
    },


    /**
     * Завершение сессии текущего пользователя
     * @param parameters
     * @returns {{text: string, values: [*], func: string}}
     */
    logOut: function (parameters) {
        return {
            text: 'SELECT log_out_user($1)',
            values: [parameters.token],
            func: 'log_out_user'
        }
    },


    /**
     * Получение списка структурных подразделений
     * @param parameters
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
     * @param parameters
     * @returns {{text: string, values: [*], func: string}}
     */
    getContactsByDivisionId: function (parameters) {
        return {
            text: 'SELECT get_contacts_by_division_id($1, $2)',
            values: [parameters.divisionId, parameters.token],
            func: 'get_contacts_by_division_id'
        }
    },


    /**
     * Поиск абонентов
     * @param parameters
     * @returns {{text: string, values: [*], func: string}}
     */
    searchContacts: function (parameters) {
        return {
            text: 'SELECT search_contacts($1)',
            values: [parameters.search],
            func: 'search_contacts'
        }
    },


    /**
     * Изменение данных абонента
     * @param parameters
     * @returns {{text: string, values: Array, func: string}}
     */
    editContact: function (parameters) {
        return {
            text: 'SELECT edit_contact($1, $2, $3, $4, $5, $6, $7)',
            values: [
                parameters.contactId,
                parameters.surname,
                parameters.name,
                parameters.fname,
                parameters.position,
                parameters.email,
                parameters.mobile
            ],
            func: 'edit_contact'
        }
    },


    /**
     * Добавление абонента в избранные
     * @param parameters
     * @returns {{text: string, values: [*,*], func: string}}
     */
    addContactToFavorites: function (parameters) {
        return {
            text: 'SELECT add_contact_to_favorites($1, $2)',
            values: [parameters.contactId, parameters.token],
            func: 'add_contact_to_favorites'
        }
    },


    /**
     * Удаление абонента из избранных
     * @param parameters
     * @returns {{text: string, values: [*,*], func: string}}
     */
    removeContactFromFavorites: function (parameters) {
        return {
            text: 'SELECT delete_contact_from_favorites($1, $2)',
            values: [parameters.contactId, parameters.token],
            func: 'delete_contact_from_favorites'
        }
    },


    /**
     * Добавление фото абонента
     * @param contactId
     * @param url
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
            text: 'SELECT set_contact_division($1, $2)',
            values: [parameters.contactId, parameters.divisionId],
            func: 'set_contact_division'
        }
    },


    /**
     * Добавление телефона абоненту
     * @param parameters
     * @returns {{text: string, values: [null,null,null], func: string}}
     */
    addContactPhone: function (parameters) {
        return {
            text: 'SELECT add_contact_phone($1, $2, $3)',
            values: [parameters.contactId, parameters.atsId, parameters.number],
            func: 'add_contact_phone'
        }
    },

    /**
     * Изменение телефона абонента
     * @param parameters
     * @returns {{text: string, values: [*,*,*], func: string}}
     */
    editContactPhone: function (parameters) {
        return {
            text: 'SELECT edit_contact_phone($1, $2, $3)',
            values: [parameters.phoneId, parameters.atsId, parameters.number],
            func: 'edit_contact_phone'
        }
    },

    /**
     * Удаление телефона абонента
     * @param parameters
     * @returns {{text: string, values: [*], func: string}}
     */
    deleteContactPhone: function (parameters) {
        return {
            text: 'SELECT delete_contact_phone($1)',
            values: [parameters.phoneId],
            func: 'delete_contact_phone'
        }
    }
};
