const cliProgress = require('cli-progress');
const imageCheck = require('./image-check');
const sharp = require('sharp');

function resizeSingleImage(image, destination, width, height) {
    const progress = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
    progress.start(1, 0);

    return new Promise(async (resolve, reject) => {
        try {
            await imageCheck(image);

            const filePathParts = image.split('/');
            const fileNameParts = filePathParts[filePathParts.length - 1].split('.');
            const fileExtension = fileNameParts.pop();

            sharp(image)
                .resize(width, height, {
                    fit: 'contain',
                    background: 'transparent'
                })
                .toFile(`${destination}/${fileNameParts.join('.')}-${width}x${height}.${fileExtension}`,
                    e => {
                        if (e) {
                            reject('');
                        } else {
                            progress.update(1);
                            progress.stop();
                            resolve();
                        }
                    });
        } catch (e) {
            progress.stop();
            reject(e);
        }
    });
}

module.exports = resizeSingleImage;
