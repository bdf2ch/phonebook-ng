module.exports = {

    /**
     * Получение списка структурных подразделений
     * @param parameters
     * @returns {{text: string, values: Array, func: string}}
     */
    getDivisionList: function (parameters: any) {
        return {
            text: 'SELECT get_phonebook_divisions()',
            values: <any[]>[],
            func: 'get_phonebook_divisions'
        };
    },

    /**
     *
     * @param parameters
     * @returns {{text: string, values: [*], func: string}}
     */
    getContactsByDivisionId: function (parameters: any) {
        return {
            text: 'SELECT get_contacts_by_division_id($1)',
            values: [parameters.divisionId],
            func: 'get_contacts_by_division_id'
        }
    }
};