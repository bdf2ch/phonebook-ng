var cookies = require('cookies');

module.exports = {

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

    onLogOutSuccess: function (parameters) {
        return true;
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
     *
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
     *
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
     *
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
     *
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
     *
     * @param parameters
     * @returns {{text: string, values: [*,*], func: string}}
     */
    setContactDivision: function (parameters) {
        return {
            text: 'SELECT set_contact_division($1, $2)',
            values: [parameters.contactId, parameters.divisionId],
            func: 'set_contact_division'
        }
    }
};
