exports.isEnglishLetter = (char) => {
  return char && char.length === 1 && /[a-z]/i.test(char);
}

exports.shiftLetter = (l, shift) => {
  const charCode = l.charCodeAt(0);
  const baseCode = (l === l.toUpperCase()) ? 65 : 97;
  return String.fromCharCode(((charCode - baseCode + shift) % 26) + baseCode);
}