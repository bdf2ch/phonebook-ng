"use strict";


const jimp = require('jimp');
const utilities = require('../common/utilities');


const path = '/var/wwwn/phonebook/static/assets/images/users/';


const resize = async() => {
    const files = await utilities.getFolderContent(path);
    files.forEach(async (item) => {
        let isItemIsFolder = await utilities.isFolder(item);
        if (isItemIsFolder) {
            const photos = await utilities.getFolderContent(item);
            photos.forEach((photoUrl) => {
                if (photoUrl.indexOf('thumbnail') === -1) {
                    jimp.read(photoUrl, function (err, photo) {
                        if (err) throw err;
                        if (photo.bitmap.width > 480) {
                            console.log(photoUrl + ' - ' + photo.bitmap.width + 'px X ' + photo.bitmap.height + 'px');
                            //photo.resize(480, 320).quality(70).write(photoUrl);
                        }
                    });
                }
            });
        }
    });
};

resize();