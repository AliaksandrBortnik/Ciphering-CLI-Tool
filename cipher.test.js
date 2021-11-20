const Cipher = require('./cipher');

describe('Ciphers in action', () => {
  test('should process Atbash cipher correctly', () => {
    const sourceText = 'This is secret. Message about "_" symbol!';
    const result = Cipher.processAtbash(sourceText);
    expect(result).toBe('Gsrh rh hvxivg. Nvhhztv zylfg "_" hbnylo!');
  });

  test('should process Atbash cipher correctly back and forth', () => {
    const sourceText = 'Gsrh rh hvxivg. Nvhhztv zylfg "_" hbnylo!';
    const result = Cipher.processAtbash(sourceText);
    expect(result).toBe('This is secret. Message about "_" symbol!');
  });

  test('should encode Caesar cipher correctly', () => {
    const sourceText = 'This is secret. Message about "_" symbol!';
    const result = Cipher.processROTN(sourceText, 1, true);
    expect(result).toBe('Uijt jt tfdsfu. Nfttbhf bcpvu "_" tzncpm!');
  });

  test('should decode Caesar cipher correctly', () => {
    const sourceText = 'Uijt jt tfdsfu. Nfttbhf bcpvu "_" tzncpm!';
    const result = Cipher.processROTN(sourceText, 1, false);
    expect(result).toBe('This is secret. Message about "_" symbol!');
  });

  test('should encode ROT8 cipher correctly', () => {
    const sourceText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
    const result = Cipher.processROTN(sourceText, 8, true);
    expect(result).toBe('Twzmu Qxacu qa aquxtg lcuug bmfb wn bpm xzqvbqvo ivl bgxmambbqvo qvlcabzg.');
  });
});