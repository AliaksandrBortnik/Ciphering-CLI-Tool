const { Transform } = require('stream');
const { isEnglishLetter } = require('../helpers');

class AtbashTransform extends Transform {
  constructor(options = {}) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const data = processAtbashCipher(chunk.toString());
    callback(null, data);
  }
}

function processAtbashCipher(text) {
  return text.split('')
    .map(l => {
      if (!isEnglishLetter(l)) {
        return l;
      }
      const charCode = l.charCodeAt(0);
      const baseCode = (l === l.toUpperCase()) ? 65 : 97;
      return String.fromCharCode(25 - (charCode - baseCode) + baseCode);
    })
    .join('');
}

module.exports = AtbashTransform;