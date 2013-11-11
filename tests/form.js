var rstream = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , request = require('request')
  , http = require('http')
  , tests = {}
  , gm = require('gm')
  , im = gm.subClass({ imageMagick: true })
  , clobber = require('./fixtures/clobber')
  , fixtures = require('./fixtures');

tests['resize nocropnofit'] = function (next) {
  var opts
    , serv = http.createServer(function (req, resp) {
        rstream.resizeReq(req
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

                resp.writeHead(200, {
                  'Content-Length': 2,
                  'Content-Type': 'text/plain' });
                resp.write('ok');
                resp.end();
              });
            });
          });
      });

  serv.listen(5000);

  fs.readFile(fixtures.nocropnofit.original, function (err, data) {
    assert.ifError(err);

    opts = {
      method: 'POST'
    , multipart: [{
        body: data
      , 'Content-Disposition' : 'form-data; name="image"; filename="image.jpg"'
      , 'Content-Type' : 'image/jpeg'
      }]
    };

    request('http://localhost:5000', opts, function (err, resp, body) {
      assert.ifError(err);
      assert.equal(body, 'ok');
      serv.close(function () {
        next();
      });
    })
  });
};

tests['before'] = clobber;
tests['after'] = clobber;

module.exports = tests;
