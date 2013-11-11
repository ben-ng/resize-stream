var path = require('path')
  , fs = require('fs')
  , gm = require('gm')
  , imagemagick = gm.subClass({ imageMagick: true })
  , temp = require('temp')
  , formidable = require('formidable')
  , fileFromForm
  , resizeForm
  , resizeFile
  , resizeStream
  , defaults;

temp.track();

defaults = {
  width: 320
, height: 320
, autoOrient: true
, crop: true
};

/**
* Writes a form to disk
* @param {http.request} request
* @param {function} callback (err)
*/
fileFromForm = function (req, cb) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.maxFieldsSize = 1000;
  form.maxFields = 1;

  form.parse(req, function(err, fields, files) {
    var keys = Object.keys(files);

    if(err)
      return cb(err);

    if(keys.length == 0)
      return cb(new Error('No files found in multipart form'));

    if(keys.length > 1)
      return cb(new Error('More than one file found in multipart form'));

    cb(null, files[keys[0]].path);
  });
};

/**
* Resize a multipart form
* @param {http.request} request
* @param {object} [options]
* @param {function} callback (err, readableStream, contentLength)
*/
resizeReq = function (req, opts, cb) {
  if(!cb) {
    cb = opts;
    opts = {};
  }

  fileFromForm(req, function (err, filePath) {
    resizeFile(filePath, opts, cb);
  });
};

/**
* Resize a stream
* @param {streams.Readable} fileStream
* @param {object} [options]
*   @param {string} [options.ext] - Defaults to .jpg
* @param {function} callback (err, readableStream, contentLength)
*/
resizeStream = function (inStream, opts, cb) {
  if(!cb) {
    cb = opts;
    opts = {};
  }

  opts = JSON.parse(JSON.stringify(opts));
  opts.width = opts.width || defaults.width;
  opts.height = opts.height || defaults.height;
  opts.fit = opts.fit !== false;
  opts.crop = opts.crop !== false;
  opts.autoOrient = opts.autoOrient || defaults.autoOrient;

  im = imagemagick(inStream);

  if(opts.autoOrient)
    im.autoOrient();

  if(opts.crop) {
    im.gravity('Center').resize(opts.width, opts.height, '^').crop(opts.width, opts.height, 0, 0);
  }
  else {
    if(opts.fit) {
      im.resize(opts.width, opts.height);
    }
    else {
      im.resize(opts.width, opts.height, '!');
    }
  }

  temp.open({suffix: opts.ext || '.jpg'}, function (err, info) {
    if(err)
      return cb(err);

      fs.close(info.fd, function (err) {
        if(err)
          return cb(err);

        im.stream()
          .pipe(fs.createWriteStream(info.path))
          .on('close', function () {
            fs.stat(info.path, function (err, stat) {
              if(err)
                return cb(err);

              cb(null, fs.createReadStream(info.path), stat.size, info.path);
            });
          })
          .on('error', function (err) {
            cb(err);
          });
      });
  });
};

/**
* Resize a file
* @param {string} filePath
* @param {object} [options]
* @param {function} callback (err, readableStream, contentLength)
*/
resizeFile = function (filePath, opts, cb) {
  var tmpFile
    , im;

  if(!cb) {
    cb = opts;
    opts = {};
  }

  opts = JSON.parse(JSON.stringify(opts));
  opts.ext = path.extname(filePath);

  resizeStream(fs.createReadStream(filePath), opts, cb);
};

module.exports = {
  resizeReq: resizeReq
, resizeFile: resizeFile
, resizeStream: resizeStream
, fileFromForm: fileFromForm
};
