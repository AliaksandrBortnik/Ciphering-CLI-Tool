const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports.getOutputStream = (args) => {
  if (isOutputFileSpecified(args)) {
    const outputFilePath = getOutputFilePath(args);
    checkFileAccessibleToWrite(outputFilePath);
    return fs.createWriteStream(outputFilePath, { flags: 'a' });
  } else {
    return process.stdout;
  }
}

function checkFileAccessibleToWrite(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK | fs.constants.W_OK)
  } catch (err) {
    process.stderr.write(`No permission to write or file is not found: ${filePath}`);
    process.exit(1);
  }
}

function isOutputFileSpecified(args) {
  return args.hasOwnProperty('-o');
}

function getOutputFilePath(args) {
  return path.join(__dirname, '..', args['-o']);
}