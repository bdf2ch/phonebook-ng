module.exports = {

    getDivisionList: function () {
        return {
            text: 'SELECT get_phonebook_divisions()',
            values: [],
            func: 'get_phonebook_divisions'
        };
    },

    getContactsByDivisionId: function (parameters) {
        return {
            text: 'SELECT get_contacts_by_division_id($1)',
            values: [parameters.divisionId],
            func: 'get_contacts_by_division_id'
        }
    }

};
