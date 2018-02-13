"use strict";
const postgres = require('./postgres');


module.exports = {

    /**
     * Получение информации о сессии
     * @param token {String} - Токен сессии пользователя
     */
    getByToken: (token) => {
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
            }
        });
    },

    /**
     * Завершение сессии текущего пользователя
     * @param token {String} - Токен сессии пользователя
     * @param response {Object} - Ответ сервера
     */
    end: (token, response) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await postgres.query({
                    text: 'SELECT log_out_user($1)',
                    values: [token],
                    func: 'log_out_user'
                });
                response.clearCookie('kolenergo');
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },


    /**
     * Удаляет cookie с информацией о сессии пользователя
     * @param response
     */
    removeCookie: function(response) {
        response.clearCookie('kolenergo');
        //return parameters;
    }

};