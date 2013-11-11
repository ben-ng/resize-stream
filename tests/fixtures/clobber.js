var fs = require('fs')
  , fixtures = require('./index');

module.exports = function (next) {
  fs.unlink(fixtures.nocropnofit.resized, function (err) {
    fs.unlink(fixtures.nocropfit.resized, function (err) {
      fs.unlink(fixtures.crop.resized, function (err) {
        next();
      });
    });
  });
};
