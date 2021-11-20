const { isEnglishLetter, shiftLetter} = require('./alphabet-helpers');

describe('Alphabet helpers', () => {
  test('A should be English alphabet letter', () => {
    const result = isEnglishLetter('A');
    expect(result).toBe(true);
  });

  test('% should NOT be English alphabet letter', () => {
    const result = isEnglishLetter('%');
    expect(result).toBe(false);
  });

  test('A should become C letter shifting by 2', () => {
    const result = shiftLetter('A', 2);
    expect(result).toBe('C');
  });

  test('a should NOT become Z letter shifting by 25', () => {
    const result = shiftLetter('a', 25);
    expect(result).not.toBe('Z');
  });

  test('W should become W letter shifting by 26', () => {
    const result = shiftLetter('W', 26);
    expect(result).toBe('W');
  });
})