var rstream = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , tests = {}
  , gm = require('gm')
  , im = gm.subClass({ imageMagick: true })
  , clobber = require('./fixtures/clobber')
  , fixtures = require('./fixtures')
  , createTest;

createTest = function (fixture) {
  tests['resize ' + fixture] = function (next) {
    rstream.resizeStream(fs.createReadStream(fixtures[fixture].original)
      , fixtures[fixture].size
      , function (err, outStream, cLength) {
        assert.ifError(err);
        assert.notEqual(outStream, null);
        assert.notEqual(cLength, null);

        var ws = fs.createWriteStream(fixtures[fixture].resized);

        outStream.pipe(ws);

        ws.on('close', function () {
          im(fixtures[fixture].resized).size(function (err, fsize) {
            assert.ifError(err);
            assert.deepEqual(fsize.height, fixtures[fixture].expected.height);
            assert.deepEqual(fsize.width, fixtures[fixture].expected.width);

            next();
          });
        });
      });
  };
};

createTest('nocropnofit');
createTest('nocropfit');
createTest('crop');

tests['before'] = clobber;
tests['after'] = clobber;

module.exports = tests;
