const { isEnglishLetter, shiftLetter } = require('./alphabet-helper');

class Cipher {
  static processROTN(text, shiftN, isEncoding) {
    const shift = isEncoding ? shiftN : -shiftN;
    const correlatedShift = shift < 0 ? shift + 26 : shift; // Loop shift when below 0

    return text.split('')
      .map(l => !isEnglishLetter(l) ? l : shiftLetter(l, correlatedShift))
      .join('');
  }

  static processAtbash(text) {
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
}

module.exports = Cipher;