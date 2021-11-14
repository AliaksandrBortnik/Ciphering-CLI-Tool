const process = require('process');
const { pipeline } = require('stream');
const { getInputStream } = require('./Readable/input-stream');
const { getOutputStream } = require('./Writable/output-stream');
const { parseArgs } = require('./args-handler');
const { getTransformCiphers } = require('./Transforms/transform-builder');
const ValidationError = require('./Errors/validation-error');
const FileAccessError = require('./Errors/file-access-error');

try {
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
        process.stderr.write(err.message);
        process.exit(1);
      }
    }
  );
} catch (err) {
  if (err instanceof ValidationError) {
    process.stderr.write(`Validation error: ${err.message}`);
  } else if (err instanceof FileAccessError) {
    process.stderr.write(`File error: ${err.message}`);
  } else {
    process.stderr.write(err.message);
  }
  process.exit(1);
}


