#!/usr/bin/env node
const yargs = require('yargs'),
    _cliProgress = require('cli-progress'),
    fs = require('fs'),
    sharp = require('sharp'),
    colors = require('colors'),
    defaults = require('./defaults'),
    args = yargs.argv,
    image = args.image ? args.image : defaults.image,
    destination = args.destination ?
        args.destination.slice(-1) === '/' ?
            args.destination.substr(0, args.destination.length - 1) :
            args.destination :
        defaults.destination,
    allowedImage = /(\.jpg|\.jpeg|\.png|\.gif)$/i,
    allowedConfig = /(\.json)$/i;

/**
 * Start with checking the image
 * Does it exist?
 * Does is have one of the allowed extensions?
 */
if (!(fs.existsSync(image) && allowedImage.exec(image))) {
    console.log(`The file '${image}' cannot be found or is not an image`.red);
    return;
} else {
    let config;
    if (args.config) {
        /**
         * Check the config file, if given through `config` parameter
         * Is it a JSON file?
         */
        if (fs.existsSync(args.config) && allowedConfig.exec(args.config)) {
            try {
                /**
                 * Try parsing the JSON file
                 */
                config = JSON.parse(fs.readFileSync(args.config, 'utf8'));
            } catch {
                /**
                 * JSON parse error, invalid JSON structure
                 */
                console.log(`The file '${args.config}' has an invalid JSON structure`.red);
                return;
            }

            if (!config.hasOwnProperty('sizes')) {
                /**
                 * Does the config file have the required `sizes` property
                 */
                console.log(`The file '${args.config}' does not have 'sizes' property. Check the docs for further information.`.red);
                console.log(' --> https://github.com/thomasblom/quick-resize 📄👀'.blue);
                return;
            }
        } else {
            /**
             * Show an error to the user, config file cannot be found
             */
            console.log(`The file '${args.config}' cannot be found`.red);
            return;
        }
    } else {
        /**
         * Set config to default settings
         */
        config = defaults.config;
    }

    try {
        /**
         * Check if the destination exists
         * Do we have access?
         */
        fs.accessSync(destination, fs.W_OK);
    } catch {
        try {
            /**
             * Create the missing folder
             */
            const folders = destination.split('/').filter(item => !!item);
            let path = '';
            folders.forEach(folder => {
                fs.mkdirSync(path + folder);
                path += folder + '/';
            });
            console.log(`Created missing '${destination}' folder`.cyan);
        } catch {
            /**
             * Folder cannot be created
             */
            console.log(`Could not create missing '${destination}' folder`.red);
            return;
        }
    }

    let filePrefix = image.split('.'),
        error = false,
        lastFile,
        index = 0;
    const fileExt = filePrefix.pop();
    filePrefix = filePrefix.join('.');

    const progress = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
    progress.start(config.sizes.length, 0);

    const resizing = new Promise((resolve, reject) => {
        config.sizes.forEach(size => {
            let width, height;
            if (Array.isArray(size)) {
                [width, height] = size;
            } else {
                width = size;
                height = size;
            }

            if (!error) {
                sharp(image, {
                    density: config.density
                })
                    .resize(width, height)
                    .toFile(destination + '/' + filePrefix + '-' + width + 'x' + height + '.' + fileExt,
                        e => {
                            if (e) {
                                error = true;
                                lastFile = {
                                    width: width,
                                    height: height,
                                    destination: destination
                                };
                                reject();
                            } else {
                                index++;
                                progress.update(index);
                                if (index === config.sizes.length) {
                                    resolve();
                                }
                            }
                        });
            }
        });
    });

    resizing
        .then(() => {
            progress.stop();
            console.log('Successfully generated requested images and saved into destination folder'.green);
            console.log('That was quick, right? Tell your friends!'.magenta, '💥🔥');
            console.log(' --> https://github.com/thomasblom/quick-resize'.blue);
        })
        .catch(() => {
            progress.stop();
            console.log(`Resizing failed at size ${lastFile.width}x${lastFile.height} to destination '${lastFile.destination}'`.red);
        });
}