const fs = require('fs');
const path = require('path');
const process = require('process');
const FileAccessError = require('../errors/file-access-error');

module.exports.getInputStream = (args) => {
  if (isInputFileSpecified(args)) {
    const inputFilePath = getInputFilePath(args);
    checkFileAccessibleToRead(inputFilePath);
    return fs.createReadStream(inputFilePath);
  } else {
    return process.stdin;
  }
}

function checkFileAccessibleToRead(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK | fs.constants.R_OK)
  } catch (err) {
    throw new FileAccessError(`No permission to read or file is not found.`);
  }
}

function isInputFileSpecified(args) {
  return args.hasOwnProperty('-i');
}

function getInputFilePath(args) {
  return path.join(__dirname, '..', args['-i']);
}