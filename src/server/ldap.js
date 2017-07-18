var ldapjs = require('ldapjs');

//ldapjs.Attribute.settings.guid_format = ldapjs.GUID_FORMAT_B;
//console.log(ldapjs.Attribute);

module.exports = {
    login: function (account, password, response) {

        var client = ldapjs.createClient({
            url: 'ldap://10.50.0.1/'
        });

        var opts = {
            filter: '(&(objectCategory=person)(sAMAccountName=' + account + '))',
            scope: 'sub',
            attributes: ['objectGUID', 'name', 'cn', 'mail', 'samaccountname']
        };

        client.bind('NW\\' + account, password, function (err) {
            if (err) {
                console.log(err);
            } else {
                client.search('OU=02_USERS,OU=Kolenergo,DC=nw,DC=mrsksevzap,DC=ru', opts, function (err, search) {
                    search.on('searchEntry', function (entry) {
                        console.log(entry.object);
                        response.end(JSON.stringify(true));
                        return true;
                    });
                });
            }
        });
    }
};
