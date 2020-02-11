const cliProgress = require('cli-progress');
const imageCheck = require('./image-check');
const sharp = require('sharp');

function resizeMultipleImagesMultipleSizes(images, destination, sizes) {
    const progress = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
    let currentProgress = 0;
    progress.start(images.length * sizes.length, currentProgress);

    return new Promise((resolve, reject) => {
        images.forEach(async image => {
            try {
                await imageCheck(image);

                const filePathParts = image.split('/');
                const fileNameParts = filePathParts[filePathParts.length - 1].split('.');
                const fileExtension = fileNameParts.pop();

                sizes.forEach(size => {
                    sharp(image)
                        .resize(size.width, size.height, {
                            fit: 'contain',
                            background: 'transparent'
                        })
                        .toFile(`${destination}/${fileNameParts.join('.')}-${size.width}x${size.height}.${fileExtension}`,
                            e => {
                                if (e) {
                                    reject('');
                                } else {
                                    currentProgress++;
                                    progress.update(currentProgress);

                                    if (currentProgress === images.length * sizes.length) {
                                        progress.stop();
                                        resolve();
                                    }
                                }
                            });
                });
            } catch (e) {
                progress.stop();
                reject(e);
                return false;
            }
        });
    });
}

module.exports = resizeMultipleImagesMultipleSizes;
