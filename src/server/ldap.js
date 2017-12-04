var ldapjs = require('ldapjs');


module.exports = {
    logIn: function (parameters) {
            var client = ldapjs.createClient({ url: 'ldap://10.50.0.1/' });
            var bind = new Promise(function(bindResolve, bindReject) {
                client.bind('NW\\' + parameters.data.account, parameters.data.password, function (error) {
                    if (error) {
                        console.log(error);
                        bindReject(error);
                    } else {
                        var search = new Promise(function (searchResolve, searchReject) {
                            var opts = {
                                filter: '(&(objectCategory=person)(sAMAccountName=' + parameters.data.account + '))',
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
                                            searchResolve({
                                                text: 'SELECT auth_user($1, $2)',
                                                values: [parameters.data.account, 20000],
                                                func: 'auth_user'
                                            });
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
            return bind;
    },

    logInUser: function (parameters) {
        var client = ldapjs.createClient({ url: 'ldap://10.50.0.1/' });
        var bind = new Promise(function(bindResolve, bindReject) {
            client.bind('NW\\' + parameters.data.account, parameters.data.password, function (error) {
                if (error) {
                    console.log(error);
                    bindReject(error);
                } else {
                    var search = new Promise(function (searchResolve, searchReject) {
                        var opts = {
                            filter: '(&(objectCategory=person)(sAMAccountName=' + parameters.data.account + '))',
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
        return bind;
    }
};
