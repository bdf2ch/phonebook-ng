"use strict";


const postgres = require('./postgres');


module.exports = {
    getUserById: (userId) => {
        return new Promise(async (resolve, reject) => {
            console.log('fetching user');
            try {
                let user = await postgres.query({
                    text: 'SELECT get_user_by_id($1)',
                    values: [userId],
                    func: 'get_user_by_id'
                });
                resolve(user);
            } catch (err) {
                reject(err);
            }
        });
    },

    searchUsers: (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await postgres.query({
                    text: 'SELECT search_users($1)',
                    values: [query],
                    func: 'search_users'
                });
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};