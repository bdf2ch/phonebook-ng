'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'kolu-mail.nw.mrsksevzap.ru',
    port: 25,
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: '"Телефонный справочник" <phonebook@kolenergo.ru>', // sender address
    to: 'aepirogov@kolenergo.ru', // list of receivers
    subject: 'Загружено фото абонента', // Subject line
    text: 'Test phonebook message', // plain text body
    html: '<b>Test phonebook message</b>', // html body,
    attachments: [
        {   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
        },
        {   // binary buffer as an attachment
            filename: 'text2.txt',
            content: new Buffer('hello world!', 'utf-8')
        },
        //{   // file on disk as an attachment
        //    filename: 'text3.txt',
        //    path: '/path/to/file.txt' // stream this file
        //},
        //{   // filename and content type is derived from path
        //    path: '/path/to/file.txt'
        //},
        //{   // stream as an attachment
        //    filename: 'text4.txt',
        //    content: fs.createReadStream('file.txt')
        //},
        //{   // define custom content type for the attachment
        //    filename: 'text.bin',
        //    content: 'hello world!',
        //    contentType: 'text/plain'
        //},
        //{   // use URL as an attachment
        //    filename: 'license.txt',
        //    path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        //},
        //{   // encoded string as an attachment
        //    filename: 'text1.txt',
        //    content: 'aGVsbG8gd29ybGQh',
        //    encoding: 'base64'
        //},
        //{   // data uri as an attachment
        //    path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        //},
        //{
        // use pregenerated MIME node
        //    raw: 'Content-Type: text/plain\r\n' +
        //    'Content-Disposition: attachment;\r\n' +
        //    '\r\n' +
        //    'Hello world!'
        //}
    ]
};


transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
