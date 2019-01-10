# Quick resize
This package is made to resize images, especially for [Ionic](https://ionic.io) app icons.

#### Start using
Start with installing the package: `$ npm install -g quick-resize`  

##### Parameters
Parameter | Description | Default
--- | --- | ---
`--image` | The image to resize | `image.png` in execution folder
`--destination` | The destination folder for your generated images | `images/` in your execution folder
`--config` | JSON config file | [Check config settings](#config-settings)

#### Config settings
The config file must be a `.json` file with a valid structure. The default config settings are like:
```json
{
    "sizes": [16, 32, 48, 64, 128, 256, 512, 1024],
    "density": 72
}
```

##### Alternatives
The `sizes` property in your config file represents the width and height of your new images. If you want different widths and height, you can also return an array with a width and height like this:
```json
{
    "sizes": [[16, 32], [48, 64], [128, 256], [512, 1024]],
    "density": 72
}
```
