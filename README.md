# Quick resize
Use this package to easily resize images.
#### Installation
Start with installing the package:  `$ npm install -g quick-resize`  

#### Usage
Execute in your command line:  
```
$ quick-resize --image=image.png --destination=resized/ [--config=resize-config.json] [--width=256] [--height=256]
```

##### Parameters
Parameter | Description
--- | --- |
`--config` | JSON config file |
`--image` | The image to resize |
`--destination` | The destination folder for your generated images |
`--width` | Width of the resized image
`--height` | Height of the resized image

##### Configuration
By using the `config` parameter, the rest of the possible parameters won't be used.
The `image`, `destination`, `width` and `height` parameter must be present in this JSON file. Besides these parameters, there are some more:

Parameter | Type | Description
--- | ---| ---|
`image` | String |The image to resize |
`destination` | String |The destination folder for your generated images |
`width` | Number| Width of the resized image
`height` | Number |Height of the resized image
`multipleImages` | Boolean | If `true`, `images` will be used instead of `image`. Default is `false`
`images` | String[] | Array of images to resize
`multipleSizes` | Boolean | If `true`, `sizes` will be used instead of `width` and `height`. Default is `false`
`sizes` | { width: Number, height: Number }[] | Array with multiple sizes

*Example config file*  
```json
{
  "image": "logo.png",
  "destination": "your/destination/folder/",
  "width": 100,
  "height": 100,
  "multipleImages": false,
  "images": [],
  "multipleSizes": false,
  "sizes": []
}
```
