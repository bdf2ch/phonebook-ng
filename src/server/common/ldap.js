const ldapjs = require('ldapjs');
const postgres = require('../common/postgres');


module.exports = {
    logIn: function (account, password) {
        return new Promise(function (bindResolve, bindReject) {
            let client = ldapjs.createClient({url: 'ldap://10.50.0.1/'});
            client.bind('NW\\' + account, password, function (error) {
                if (error) {
                    console.log(error);
                    //bindReject(null);
                    bindResolve(null);
                } else {
                    var search = new Promise(function (searchResolve, searchReject) {
                        var opts = {
                            filter: '(&(objectCategory=person)(sAMAccountName=' + account + '))',
                            scope: 'sub',
                            attributes: ['objectGUID', 'name', 'cn', 'mail', 'samaccountname'],
                            sizeLimit: 1
                        };
                        client.search('OU=02_USERS,OU=Kolenergo,DC=nw,DC=mrsksevzap,DC=ru', opts, function (err, result) {
                            var user = null;
                            result.on('searchEntry', function (entry) {
                                user = entry.object;
                            });
                            result.on('end', async (res) => {
                                if (res.status === 0) {
                                    let loggedUser = await postgres.query({
                                        text: 'SELECT auth_user($1, $2)',
                                        values: [account, 20000],
                                        func: 'auth_user'
                                    });
                                    if (user) {
                                        searchResolve(loggedUser);
                                    } else
                                        searchResolve(null);
                                }
                            });
                        });
                    });
                    bindResolve(search);
                }
            });
        });
    },

    logInUser: function (account, password) {
        return new Promise(function(bindResolve, bindReject) {
            let client = ldapjs.createClient({ url: 'ldap://10.50.0.1/' });
            client.bind('NW\\' + account, password, function (error) {
                if (error) {
                    console.log(error);
                    bindReject(error);
                } else {
                    var search = new Promise(function (searchResolve, searchReject) {
                        var opts = {
                            filter: '(&(objectCategory=person)(sAMAccountName=' + account + '))',
                            scope: 'sub',
                            attributes: ['objectGUID', 'name', 'cn', 'mail', 'samaccountname'],
                            sizeLimit: 1
                        };
                        client.search('OU=02_USERS,OU=Kolenergo,DC=nw,DC=mrsksevzap,DC=ru', opts, function (err, result) {
                            var user = null;
                            result.on('searchEntry', function (entry) {
                                user = entry.object;
                            });
                            result.on('end', function (res) {
                                if (res.status === 0) {
                                    if (user) {
                                        console.log(user);
                                        searchResolve(JSON.stringify(user));
                                    } else
                                        searchResolve(null);
                                }
                            });
                        });
                    });
                    bindResolve(search);
                }
            });
        });
    }
};
