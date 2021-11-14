const process = require('process');
const { pipeline } = require('stream');
const { getInputStream } = require('./Readable/input-stream');
const { getOutputStream } = require('./Writable/output-stream');
const { parseArgs } = require('./args-handler');
const { getTransformCiphers } = require('./Transforms/transform-builder');

const args = parseArgs();
const inputStream = getInputStream(args);
const transformStreams = getTransformCiphers(args);
const outputStream = getOutputStream(args);

pipeline(
  inputStream,
  ...transformStreams,
  outputStream,
  (err) => {
    if (err) {
      process.stderr.write('Something went wrong...', err);
    }
  }
);