const fileSystem = require('fs');

function imageCheck(image) {
    return new Promise(function (resolve, reject) {
        try {
            /**
             * Check if the image exists
             */
            fileSystem.accessSync(image, fileSystem.W_OK);
            resolve();
        } catch {
            reject(`The image '${image}' does not exist`.red);
        }
    });
}

module.exports = imageCheck;
