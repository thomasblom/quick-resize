const cliProgress = require('cli-progress');
const imageCheck = require('./image-check');
const sharp = require('sharp');

function resizeMultipleImages(destination, images, width, height) {
    const progress = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
    let currentProgress = 0;
    progress.start(images.length, currentProgress);

    return new Promise((resolve, reject) => {
        images.forEach(async image => {
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
                                currentProgress++;
                                progress.update(currentProgress);

                                if (currentProgress === images.length) {
                                    progress.stop();
                                    resolve();
                                }
                            }
                        });
            } catch (e) {
                progress.stop();
                reject(e);
                return false;
            }
        });
    });
}

module.exports = resizeMultipleImages;
