const { Transform } = require('stream');
const Cipher = require('../cipher');

class AtbashTransform extends Transform {
  constructor(options = {}) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const data = Cipher.processAtbash(chunk.toString());
    callback(null, data);
  }
}

module.exports = AtbashTransform;