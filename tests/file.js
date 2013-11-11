var rstream = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , tests = {}
  , gm = require('gm')
  , im = gm.subClass({ imageMagick: true })
  , clobber = require('./fixtures/clobber')
  , fixtures = require('./fixtures');

tests['resize nocropnofit'] = function (next) {
  rstream.resizeFile(fixtures.nocropnofit.original
    , fixtures.nocropnofit.size
    , function (err, outStream, cLength) {
      assert.ifError(err);
      assert.notEqual(outStream, null);
      assert.notEqual(cLength, null);

      var ws = fs.createWriteStream(fixtures.nocropnofit.resized);

      outStream.pipe(ws);

      ws.on('close', function () {
        im(fixtures.nocropnofit.resized).size(function (err, fsize) {
          assert.ifError(err);
          assert.deepEqual(fsize.height, fixtures.nocropnofit.expected.height);
          assert.deepEqual(fsize.width, fixtures.nocropnofit.expected.width);

          next();
        });
      });
    });
};

tests['before'] = clobber;
tests['after'] = clobber;

module.exports = tests;
