var ldapjs = require('ldapjs');

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
    },

    logIn: function (parameters) {
        var client = ldapjs.createClient({
            url: 'ldap://10.50.0.1/'
        });

        var opts = {
            filter: '(&(objectCategory=person)(sAMAccountName=' + parameters.account + '))',
            scope: 'sub',
            attributes: ['objectGUID', 'name', 'cn', 'mail', 'samaccountname'],
            sizeLimit: 1
        };

        client.bind('NW\\' + parameters.account, parameters.password, function (err) {
            if (err) {
                console.log(err);
            } else {
                client.search('OU=02_USERS,OU=Kolenergo,DC=nw,DC=mrsksevzap,DC=ru', opts, function (err, search) {
                    var result = null;
                    search.on('searchEntry', function (entry) {
                        console.log(entry.object);
                        result = entry.object;
                    });

                    search.on('end', function(res) {
                        console.log('status: ' + result.status);
                        if (result) {
                            console.log(result);
                            return {
                                text: 'SELECT auth_user($1, $2)',
                                values: [parameters.account, 20000],
                                func: 'auth_user'
                            };
                        } else return null;
                    });
                });
            }
        });
    }

};
