"use strict";
const  fs = require('fs');


module.exports = {
    isFolderExists: (path) => {
        return new Promise((resolve, reject) => {
            fs.open(path, 'r', (err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve(false);
                    }
                }
                resolve(true);
            });
        });
    },


    createFolder: (path) => {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, (err) => {
                if (err) {
                    console.error(`Error creating directory '${path}'`);
                    reject({ message: 'Error creating directory', description: err });
                }
                resolve(true);
            });
        });
    },


    removeFolder: (path) => {
        return new Promise((resolve, reject) => {
            fs.rmdir(path, (err) => {
                if (err) {
                    console.error(`Error removing directory '${path}'`);
                    reject({ message: 'Error removing directory', description: err });
                }
                resolve(true);
            });
        })
    }
};