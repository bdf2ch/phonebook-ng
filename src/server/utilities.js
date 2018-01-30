"use strict";
const fs = require('fs');
const pt = require('path');


module.exports = {
    isFolder: (path) => {
        return new Promise((resolve, reject) => {
            fs.stat(path, (error, stats) => {
                if (error) {
                    console.error(`Error checking path '${path}'`);
                    reject(`Error checking path ${path}`);
                }
                if (stats.isDirectory() === true) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    },


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
                    //reject({ message: 'Error creating directory', description: err });
                    resolve(false);
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
    },

    getFolderContent: function (path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error, files) => {
                if (error) {
                    console.error(`Error getting content of directory '${path}'`);
                    reject({ message: 'Error getting directory content', description: error });
                }
                let result = [];
                files.forEach((item) => {
                    result.push(pt.resolve(path, item));
                });
                resolve(result);
            })
        });
    }
};