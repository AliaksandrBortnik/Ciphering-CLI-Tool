exports.isEnglishLetter = (char) => {
  return char && char.length === 1 && /[a-z]/i.test(char);
}