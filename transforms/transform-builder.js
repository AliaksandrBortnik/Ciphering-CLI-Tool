const AtbashTransform = require('./atbash-transform');
const RotNTransform = require('./rotn-transform');
const parseCipherQueue = require('./parse-cipher-queue');

module.exports = (args) => {
  const streams = [];
  const cipherQueue = parseCipherQueue(args);

  cipherQueue.forEach(cipherMode => {
    if (cipherMode[0] === 'A') {
      streams.push(new AtbashTransform());
    } else if (cipherMode[0].startsWith('C')) {
      streams.push(new RotNTransform(1, cipherMode[1] === '1'));
    } else if (cipherMode[0].startsWith('R')) {
      streams.push(new RotNTransform(8, cipherMode[1] === '1'));
    }
  });
  return streams;
}