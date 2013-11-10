var rstream = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , tests = {}
  , gm = require('gm')
  , im = gm.subClass({ imageMagick: true })
  , clobber
  , fixtures = require('./fixtures');

clobber = function (next) {
  fs.unlink(fixtures.kitten.resized, function (err) {
    next();
  });
};

tests['resize kitten 50x50'] = function (next) {
  rstream.resizeStream(fs.createReadStream(fixtures.kitten.original)
    , fixtures.kitten.size
    , function (err, outStream, cLength) {
      assert.ifError(err);
      assert.notEqual(outStream, null);
      assert.notEqual(cLength, null);

      var ws = fs.createWriteStream(fixtures.kitten.resized);

      outStream.pipe(ws);

      ws.on('close', function () {
        im(fixtures.kitten.resized).size(function (err, fsize) {
          assert.ifError(err);
          assert.deepEqual(fixtures.kitten.size, fsize);

          next();
        });
      });
    });
};

tests['before'] = clobber;
tests['after'] = clobber;

module.exports = tests;
