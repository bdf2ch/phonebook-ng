"use strict";


const postgres = require('./postgres');


module.exports = {
    getUserById: (userId) => {
        return new Promise(async (resolve) => {
            console.log('fetching user');
            let user = await postgres.query({text: 'SELECT get_user_by_id($1)', values: [userId], func: 'get_user_by_id'});
            //console.log('user', user);
            resolve(user);
        });
    }
};