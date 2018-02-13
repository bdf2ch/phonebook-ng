"use strict";
const ldap = require('../common/ldap');
const express = require('express');


let router = express.Router();
router.post('/ldap', async (req, res) => {
    try {
        let result = await ldap.logInUser(
            req.body.account,          // Учетная запись пользователя
            req.body.password          // Пароль пользователя
        );
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(result));
    } catch (error) {
        res.status(500).send(JSON.stringify({
            code: 1, description: error
        }));
    }

});


module.exports = {
    routes: router
};