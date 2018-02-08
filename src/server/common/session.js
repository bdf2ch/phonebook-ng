module.exports = {

    /**
     * Удаляет cookie с данными о сессии
     * @param parameters
     */
    remove: function(response) {
        response.clearCookie('kolenergo');
        //return parameters;
    }

};