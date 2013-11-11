resize-stream
=============

[![Build Status](https://travis-ci.org/ben-ng/resize-stream.png?branch=master)](https://travis-ci.org/ben-ng/resize-stream)

Resizing images can suck. This library hopes to make that better.

**Depends on ImageMagick, so make sure you have that installed**

```
var rstream = require('resize-stream');

// From a file path
rstream.resizeFile('cat.jpg'
  , {width: 50, height: 50} // See options documentation for more
  , function (err, outStream, contentLength) {
    // outStream is a readable stream
    // contentLength makes it easy to .pipe() to S3
  });

// From a multipart form request
rstream.resizeReq(req
  , {width: 50, height: 50}
  , function (err, outStream, contentLength) {
    // etc
  });

// From a stream
rstream.resizeStream(fs.createReadStream('cat.jpg')
  , {width: 50, height: 50}
  , function (err, outStream, contentLength) {
    // etc
  });
```

Options
_______

The second parameter is always an optional options hash

 * `width`: The target width of the output image in pixels
 * `height`: The target height of the output image in pixels
 * `fit`: If `true`, will fit the input image inside the bounds of the output image. Defaults to `true`.
 * `crop`: If `true`, will ignore `fit` and crop the image instead of changing the aspect ratio. Defaults to `false`.
 * `autoOrient`: If `true`, will rotate the image using its EXIF data. Defaults to `true`.

Fit and Crop Examples
---------------------

Since these are hard to explain in words, here are some helpful images

![Original Image](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/kitten.jpg "Original Image")

| Crop  | Fit   | Result                                                                                                                     |
|:-----:|:-----:|:--------------------------------------------------------------------------------------------------------------------------:|
|`true` |Ignored|![Cropped](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/expected/kitten.crop.jpg "Cropped Image")      |
|`false`|`true` |![Fit](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/expected/kitten.noocropfit.jpg "Fit Image")        |
|`false`|`false`|![Not Fit](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/expected/kitten.nocropnofit.jpg "No Fit Image")|

To-Do
-----
 * Stream API kind of stinks, we should be a duplex stream.
 * Finer control over the imagemagick commands

License
-------
The MIT License (MIT)

Copyright (c) 2013 Ben Ng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
