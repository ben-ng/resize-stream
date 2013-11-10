var path = require('path')

module.exports = {
  kitten: {
    original: path.join(__dirname, 'kitten.jpg')
  , resized: path.join(__dirname, 'kitten.50x50.jpg')
  , size: {width: 50, height: 50}
  }
};
