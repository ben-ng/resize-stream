var fs = require('fs')
  , fixtures = require('./index');

module.exports = function (next) {
  fs.unlink(fixtures.kitten.resized, function (err) {
    next();
  });
};
