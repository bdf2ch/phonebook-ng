"use strict";


const jimp = require('jimp');
const utilities = require('./utilities');

const path = '/var/wwwn/phonebook/static/assets/images/users/';

async () => {
    const files = await utilities.getFolderContent(path);
    files.forEach(async (item) => {
        const isFolder = await utilities.isFolder(item);
        if (isFolder) {
            const photos = await utilities.getFolderContent(item);
        }
    });
};



