const { Transform } = require('stream');
const Cipher = require('../cipher');

class RotNTransform extends Transform {
  constructor(shiftN, isEncoding, options = {}) {
    super(options);
    this.shiftN = shiftN;
    this.isEncoding = isEncoding;
  }

  _transform(chunk, encoding, callback) {
    const data = Cipher.processROTN(chunk.toString(), this.shiftN, this.isEncoding);
    callback(null, data);
  }
}

module.exports = RotNTransform;