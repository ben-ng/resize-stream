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
-------

The second parameter is always an optional options hash. See the examples below for a visual guide.

| Option Name | Default Value | Effect                                                             |
|:-----------:|:-------------:|:------------------------------------------------------------------:|
| width       | 320px         | The target width of the output image in pixels                     |
| height      | 320px         | The target height of the output image in pixels                    |
| fit         | `false`       | Fit the input image inside the bounds of the output image          |
| crop        | `true`        | Crop the image instead of changing the aspect ratio or fitting     |
| autoOrient  | `true`        | Rotate the image using its EXIF data                               |

Fit and Crop Examples
---------------------

Since these are hard to explain in words, here are some visual examples.

### 450x450 Original
![Original Image](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/kitten.jpg "Original Image")
[Credit](https://pusheen.com)

| Target Dimensions | Crop  | Fit   | Result                                                                                                                      | Output Dimensions|
|:-----------------:|:-----:|:-----:|:---------------------------------------------------------------------------------------------------------------------------:|:----------------:|
| 200x400px         |`true` |Ignored|![Cropped](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/expected/kitten.crop.jpg "Cropped Image")       | 200x400px        |
| 200x400px         |`false`|`false`|![Not Fit](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/expected/kitten.nocrop.nofit.jpg "No Fit Image")| 200x400px        |
| 200x400px         |`false`|`true` |![Fit](https://raw.github.com/ben-ng/resize-stream/master/tests/fixtures/expected/kitten.nocrop.fit.jpg "Fit Image")         | 200x200px        |

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
