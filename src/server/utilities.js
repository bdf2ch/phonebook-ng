"use strict";
const fs = require('fs');
const pt = require('path');


module.exports = {
    isFolder: (path) => {
        return new Promise((resolve, reject) => {
            fs.stat(path, (error, stats) => {
                if (error) {
                    console.error(`Error checking path '${path}'`);
                }
                if (stats.isDirectory() === true) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        });
    };


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
                    reject(false);
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

    getFolderContent: (path) => {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error, files) => {
                if (error) {
                    console.error(`Error getting content of directory '${path}'`);
                    reject({ message: 'Error getting directory content', description: error });
                }
                const result = [];
                files.forEach((item) => {
                    console.log(pt.resolve(path, item));
                    result.push(pt.resolve(path, item));
                });
                resolve(result);
            })
        });
    }
};