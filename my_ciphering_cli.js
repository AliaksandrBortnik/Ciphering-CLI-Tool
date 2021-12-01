const process = require('process');
const { pipeline } = require('stream');
const { getInputStream } = require('./readable/input-stream');
const { getOutputStream } = require('./writable/output-stream');
const { parseArgs } = require('./args-handler');
const getTransformCiphers = require('./transforms/transform-builder');
const ValidationError = require('./errors/validation-error');
const FileAccessError = require('./errors/file-access-error');

try {
  const rawArgs = process.argv.slice(2);
  const args = parseArgs(rawArgs);
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
    process.stderr.write(`Validation error: ${err.message}\n`);
  } else if (err instanceof FileAccessError) {
    process.stderr.write(`File error: ${err.message}\n`);
  } else {
    process.stderr.write(err.message);
  }
  process.exit(1);
}


