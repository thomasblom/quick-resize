#!/usr/bin/env node
const arguments = require('./arguments');
const fileSystem = require('fs');
const destinationCheck = require('./actions/destination-check');
const singleImage = require('./actions/single-image');
const multipleImages = require('./actions/multiple-images');
const singleImageMultipleSizes = require('./actions/single-image-multiple-sizes');
const multipleImagesMultipleSizes = require('./actions/multiple-images-multiple-sizes');
require('colors');

(async () => {
    let action;
    if (arguments.config) {
        // Use the configuration file
        let config;
        if (fileSystem.existsSync(arguments.config)) {
            try {
                /**
                 * Try parsing the JSON file
                 */
                config = JSON.parse(fileSystem.readFileSync(arguments.config, 'utf8'));
            } catch {
                /**
                 * JSON parse error, invalid JSON structure
                 */
                console.log(`The file '${arguments.config}' has an invalid JSON structure`.red);
                return;
            }

            try {
                //
                await destinationCheck(config.destination);

                const multipleSizes = config.hasOwnProperty('multipleSizes') && config.multipleSizes;
                if (config.hasOwnProperty('multipleImages') && config.multipleImages) {
                    if (multipleSizes) {
                        const {images, destination, sizes} = config;
                        action = multipleImagesMultipleSizes(images, destination, sizes);
                    } else {
                        const {destination, images, width, height} = config;
                        action = multipleImages(destination, images, width, height);
                    }
                } else {
                    if (multipleSizes) {
                        const {image, destination, sizes} = config;
                        action = singleImageMultipleSizes(image, destination, sizes);
                    } else {
                        const {image, destination, width, height} = config;
                        action = singleImage(image, destination, width, height);
                    }
                }
            } catch (e) {
                console.log(`${e}`.red);
                return;
            }
        } else {
            /**
             * Show an error to the user, config file cannot be found
             */
            console.log(`The file '${arguments.config}' cannot be found`.red);
            return;
        }
    } else {
        // Use the given arguments in the command line
        try {
            const {image, destination, width, height} = arguments;
            await destinationCheck(destination);
            action = singleImage(image, destination, width, height);
        } catch (e) {
            console.log(`${e}`.red);
            return;
        }
    }

    action
        .then(() => {
            console.log('\nSuccessfully generated requested images and saved into destination folder'.green);
            console.log('That was quick, right? Tell your friends!'.cyan, '💥🔥');
            console.log(' --> https://www.npmjs.com/package/quick-resize'.blue);
        })
        .catch((error) => {
            console.log('Something went wrong'.red);
            console.log(`${error}`.red);
        });
})();
