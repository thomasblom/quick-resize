const fileSystem = require('fs');

function destinationCheck(path) {
    return new Promise(function (resolve, reject) {
        try {
            /**
             * Check if the destination exists
             * Do we have access?
             */
            fileSystem.accessSync(path, fileSystem.W_OK);
            resolve();
        } catch {
            try {
                /**
                 * Create the missing folder
                 */
                const folders = path.split('/').filter(item => !!item);
                let path = '';
                folders.forEach(folder => {
                    fileSystem.mkdirSync(path + folder);
                    path += `${folder}/`;
                });
                console.log(`Created missing '${path}' folder`.cyan);
                resolve();
            } catch {
                /**
                 * Folder cannot be created
                 */
                reject(`Could not create missing '${path}' folder`.red);
            }
        }
    });
}

module.exports = destinationCheck;
