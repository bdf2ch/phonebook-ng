module.exports = {

    /**
     * Удаляет cookie с данными о сессии
     * @param parameters
     */
    remove: function(parameters) {
        parameters.response.clearCookie('kolenergo');
        return parameters;
    }

};