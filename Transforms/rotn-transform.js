const { Transform } = require('stream');
const { isEnglishLetter } = require('../helpers');

class RotNTransform extends Transform {
  constructor(shiftN, isEncoding, options = {}) {
    super(options);
    this.shiftN = shiftN;
    this.isEncoding = isEncoding;
  }

  _transform(chunk, encoding, callback) {
    const data = processROTN(chunk.toString(), this.shiftN, this.isEncoding);
    callback(null, data);
  }
}

function processROTN(text, shiftN, isEncoding) {
  const shift = isEncoding ? shiftN : -shiftN;
  const correlatedShift = shift < 0 ? shift + 26 : shift; // Loop shift when below 0

  return text.split('')
    .map(l => !isEnglishLetter(l) ? l : shiftLetter(l, correlatedShift))
    .join('');
}

function shiftLetter(l, shift) {
  const charCode = l.charCodeAt(0);
  const baseCode = (l === l.toUpperCase()) ? 65 : 97;
  return String.fromCharCode(((charCode - baseCode + shift) % 26) + baseCode);
}

module.exports = RotNTransform;