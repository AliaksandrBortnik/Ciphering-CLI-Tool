const fs = require('fs');
const path = require('path');
const process = require('process');
const FileAccessError = require('../errors/file-access-error');

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
    throw new FileAccessError(`No permission to write or file is not found.`);
  }
}

function isOutputFileSpecified(args) {
  return args.hasOwnProperty('-o');
}

function getOutputFilePath(args) {
  return path.join(__dirname, '..', args['-o']);
}