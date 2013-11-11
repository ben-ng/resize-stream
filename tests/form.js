var rstream = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , request = require('request')
  , http = require('http')
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
  var opts
    , serv = http.createServer(function (req, resp) {
        rstream.resizeReq(req
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

  fs.readFile(fixtures.kitten.original, function (err, data) {
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
