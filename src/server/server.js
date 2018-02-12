var express = require('express');
var parser = require('body-parser');
//var cookieParser = require('cookie-parser');
const uploader = require('express-fileupload');
var app = express();
var phoneBook = require('./phonebook/api');
var session = require('./common/session');
var ldap = require('./common/ldap');
var path = require('path');
var process = require('process');
const upload = require('./phonebook/upload');
const feedback = require('./phonebook/feedback');
const users = require('./common/users');



process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});

process.on('ECONNRESET', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});
process.on('ETIMEDOUT', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});


/*
function send(response, result) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(result));
    responseSent = false;
};


async function sendAsync(response, apiFunc, request) {
    responseSent = true;
    try {
        let result = request ? await apiFunc(request.body) : await apiFunc();
        console.log('resp res', result);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify(result));
    } catch (error) {
        console.log('error catched', error);
        response.status(500).send(error);
    }
};
*/


app.use(function(req, res, next) {
        req.on('error', function (err) {
            console.log('error catched', err);
        });
        next();
    })
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Credentials', true);
        next();
    })
    .use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    })


    .use(express.static(path.resolve('/var/wwwn/phonebook/static/')))
    .use(express.static('/var/wwwn/phonebook/dist/'))
    .use(uploader())
    .use(parser.json())
    //.use(cookieParser())
    .get('*', (req, res) => {
        res.sendFile(path.resolve('/var/wwwn/phonebook/dist/index.html'));
    })
    .post('/api', async function (req, res, next) {
        console.dir(req.body);
        console.dir(req.cookies);

        let result = null;
        let p = req.body.data;
        try {
            switch (req.body.action) {
                case 'getInitialData':
                    result = await phoneBook.getInitialData();
                    break;
                case 'getSession':
                    result = await phoneBook.getSession(
                        p.token         // Токен сессии пользователя
                    );
                    break;
                case 'getContactGroupsByDivisionIdRecursive':
                    result = await phoneBook.getContactsByDivisionId_(
                        p.divisionId,   // Идентификатор структурного подразделения
                        p.sourceAtsId,  // Идентификатор исходной АТС
                        p.token         // Токен сессии пользователя
                    );
                    break;
                case 'getContactsByDivisionId':
                    result = await phoneBook.getContactsByDivisionId(
                        p.divisionId,   // Идентификатор структурного подразделения
                        p.sourceAtsId,  // Идентификатор исходнеой АТС
                        p.token         // Токен сессии пользователя
                    );
                    break;
                case 'getFavoriteContacts':
                    result = await phoneBook.getFavoriteContacts(
                        p.userId,       // Идентификатор пользователя
                        p.sourceAtsId   // Идентификатор исходнйо АТС
                    );
                    break;
                case 'searchContacts':
                    result = await phoneBook.searchContacts(
                        p.search,       // Строка поиска
                        p.sourceAtsId,  // Идентификатор исходнйо АТС
                        p.userId        // Идентификатор пользователя
                    );
                    break;
                case 'addContact':
                    result = await phoneBook.addContact(
                        p.userId,       // Идентификатор пользователя
                        p.divisionId,   // Идентификатор структурного подразделения
                        p.surname,      // Фамилия абонента
                        p.name,         // Имя абонента
                        p.fname,        // Отчество абонента
                        p.position,     // Должность абонента
                        p.email,        // E-mail абонента
                        p.mobile        // Мобильный телефон абонента
                    );
                    break;
                case 'editContact':
                    result = await phoneBook.editContact(
                        p.contactId,    // Идентификатор абонента
                        p.userId,       // Идентификатор пользователя
                        p.surname,      // Фамилия абонента
                        p.name,         // Имя абонента
                        p.fname,        // Отчечтво абонента
                        p.position,     // Должность абонента
                        p.email,        // E-mail абонента
                        p.mobile,       // Мобильный телефон абонента
                        p.officeId,     // Идентификатор офиса абонента
                        p.room          // Кабинет абонента
                    );
                    break;
                case 'deleteContact':
                    result = await phoneBook.deleteContact(
                        p.contactId     // Идентификатор абонента
                    );
                    break;
                case 'addContactToFavorites':
                    result = await phoneBook.addContactToFavorites(
                        p.contactId,    // Идентификатор абонента
                        p.sourceAtsId,  // Идентификатор исходной АТС
                        p.token         // Токен сессии пользователя
                    );
                    break;
                case 'removeContactFromFavorites':
                    result = await phoneBook.removeContactFromFavorites(
                        p.contactId,    // Идентификатор абонента
                        p.token         // Токен сессии пользователя
                    );
                    break;
                case 'addContactPhone':
                    result = await phoneBook.addContactPhone(
                        p.contactId,    // Идентификатор абонента
                        p.atsId,        // Идентификатор АТС
                        p.number,       // Номер телефона
                        p.sourceAtsId   // Идентификатор исходной АТС
                    );
                    break;
                case 'editContactPhone':
                    result = await phoneBook.editContactPhone(
                        p.phoneId,      // Идентфикатор телефона
                        p.atsId,        // Идентификатор АТС
                        p.number        // Номер телефона
                    );
                    break;
                case 'deleteContactPhone':
                    result = await phoneBook.deleteContactPhone(
                        p.phoneId           // Идентификатор телефона
                    );
                    break;
                case 'addDivision':
                    result = await phoneBook.addDivision(
                        p.parentId,         // Идентфикатор родительского структурного подразделения
                        p.title             // Наименование структурного подразделения
                    );
                    break;
                case 'editDivision':
                    result = await phoneBook.editDivision(
                        p.id,               // Идентификатор структурного подразделения
                        p.parentId,         // Идентификатор родительского струкктурного подразделения
                        p.officeId,         // Идентификатор офиса
                        p.title             // Наименование структкрного подразделения
                    );
                    break;
                case 'deleteDivision':
                    result = await phoneBook.deleteDivision(
                        p.divisionId,       // Идентификатор структурного подразделения
                        p.token             // Токен сессии пользователя
                    );
                    break;
                case 'addOffice':
                    result = await phoneBook.addOffice(
                        p.organizationId,   // Идентификатор организации
                        p.address           // Адрес офиса
                    );
                    break;
                case 'editOffice':
                    result = await phoneBook.editOffice(
                        p.officeId,         // Идентификатор офиса
                        p.address           // Адрес офиса
                    );
                    break;
                case 'deleteOffice':
                    result = await phoneBook.deleteOffice(
                        p.officeId          // Идентфификатор офиса
                    );
                    break;
                case 'searchUsers':
                    result = await users.searchUsers(
                        p.query             // Строка поиска
                    );
                    break;
                case 'logIn':
                    result = await ldap.logIn(
                        p.account,          // Учетная запись пользователя
                        p.password          // Пароль пользователя
                    );
                    break;
                case 'logOut':
                    result = await phoneBook.logOut(
                        p.token,            // Токен сессии пользователя
                        res                 // Ответ сервера
                    );
                    break;
                case 'LDAPAuth':
                    result = await ldap.logInUser(
                        p.account,          // Учетная запись пользователя
                        p.password          // Пароль пользователя
                    );
                    break;
                case 'setContactDivision':
                    result = await phoneBook.setContactDivision(
                        p.contactId,        // Идентификатор абонента
                        p.divisionId,       // Идентификатор структурного подразделения
                        p.sourceAtsId       // Идентификатор исходной АТС
                    );
                    break;
                case 'feedback':
                    result = await feedback.send(
                        p.userId,           // Идентфикатор пользователя
                        p.message           // Сообщение
                    );
                    break;
            }

            /**
             * Установка заголовков и оправка ответа
             */
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(result));
        } catch (error) {
            /**
             * Установка заголовков и отправка ошибки
             */
            console.log('SERVER ERROR', error);
            res.status(500).send(JSON.stringify({
                code: 1, description: error
            }));
        }





        /*
        var queue = [];
        switch (request.body.action) {
            //case 'getInitialData': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getInitialData)]; break;
            *case 'getInitialData': sendAsync(response, phoneBook.getInitialDataAsync, request); break;
            //case 'getSession': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getSession)]; break;
            *case 'getSession': sendAsync(response, phoneBook.getSessionAsync, request); break;
            case 'getDivisionList': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getDivisionList)]; break;
            //case 'getContactGroupsByDivisionIdRecursive': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getContactsByDivisionIdRecursive)]; break;
            *case 'getContactGroupsByDivisionIdRecursive': sendAsync(response, phoneBook.getContactsByDivisionIdRecursiveAsync, request); break;
            //case 'getContactsByDivisionId': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getContactsByDivisionId)]; break;
            *case 'getContactsByDivisionId': sendAsync(response, phoneBook.getContactsByDivisionIdAsync, request); break;
            *case 'getFavoriteContacts': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.getFavoriteContacts)]; break;
            //case 'searchContacts': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.searchContacts)]; break;
            *case 'searchContacts': sendAsync(response, phoneBook.searchContactsAsync, request); break;
            *case 'addContact': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContact)]; break;
            *case 'editContact': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editContact)]; break;
            *case 'deleteContact': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteContact)]; break;
            *case 'addContactToFavorites': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactToFavorites)]; break;
            *case 'removeContactFromFavorites': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.removeContactFromFavorites)]; break;
            *case 'addContactPhone': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addContactPhone)]; break;
            *case 'editContactPhone': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editContactPhone)]; break;
            *case 'deleteContactPhone': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteContactPhone)]; break;
            *case 'addDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addDivision)]; break;
            *case 'editDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editDivision)]; break;
            *case 'deleteDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteDivision)]; break;
            *case 'addOffice': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.addOffice)]; break;
            *case 'editOffice': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.editOffice)]; break;
            *case 'deleteOffice': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.deleteOffice)]; break;
            *case 'searchUsers': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.searchUsers)]; break;
            *case 'logIn': queue = [async.asyncify(postgres.query), async.asyncify(ldap.logIn)]; break;
            //case 'logOut': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.logOut), async.asyncify(session.remove)]; break;
            *case 'logOut': sendAsync(response, phoneBook.logOutAsync, request); break;
            *case 'LDAPAuth': queue = [async.asyncify(ldap.logInUser)]; break;
            case 'uploadPhoto': console.log(request.files); break;
            case 'setContactPhotoPosition': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.setContactPhotoPosition)]; break;
            *case 'setContactDivision': queue = [async.asyncify(postgres.query), async.asyncify(phoneBook.setContactDivision)]; break;
            *case 'feedback': sendAsync(response, feedback.phoneBook.send, request); break;//sendAsync(response, feedback.phoneBook.send, request); break;
        };


        if (!responseSent) {
            console.log(queue);
            var process = async.compose(...queue);
            process({data: request.body.data, response: response, request: request}, function (err, result) {
                console.log('error', err);
                console.log('result', result);
                if (err)
                    send(response, { code: 1,  message: 'No such user' });
                else
                    send(response, result);
            });
        }
        */
    })
    .post('/uploadPhoto', async (req, res) => {
        try {
            let result = await upload.uploadContactPhoto(req.body.contactId, req.files.photo);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(result));
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    })
    .post('/uploadPhotoForModeration', async (req, res) => {
        try {
            let result = await upload.uploadContactPhotoForModeration(req.body.userId, req.files.photo);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(result));
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    })
    .listen(4444, function () {
        console.log('Server started at 4444');
    }).on('error', function(err){
        console.log('ON ERROR HANDLER');
        console.log(err);
    });






