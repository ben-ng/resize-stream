var path = require('path')

module.exports = {
  nocropfit: {
    original: path.join(__dirname, 'kitten.jpg')
  , resized: path.join(__dirname, 'kitten.nocrop.fit.jpg')
  , size: {width: 200, height: 400, crop: false, fit: true}
  , expected: {width: 200, height: 200}
  }
, nocropnofit: {
    original: path.join(__dirname, 'kitten.jpg')
  , resized: path.join(__dirname, 'kitten.nocrop.nofit.jpg')
  , size: {width: 200, height: 400, crop: false, fit: false}
  , expected: {width: 200, height: 400}
  }
, crop: {
    original: path.join(__dirname, 'kitten.jpg')
  , resized: path.join(__dirname, 'kitten.crop.jpg')
  , size: {width: 200, height: 400, crop: true}
  , expected: {width: 200, height: 400}
  }
};
