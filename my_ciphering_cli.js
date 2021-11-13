const fs = require('fs');
const process = require('process');
const path = require('path');
const { pipeline } = require('stream');
const AtbashTransform = require('./Transforms/atbash-transform');
const RotNTransform = require('./Transforms/rotn-transform');

const args = getArgs();
validateArgs();

const cipherQueue = (args['-c'] || args['--config']).split('-');

const inputStream = getInputStream();
const transformStreams = getTransformCiphers();
const outputStream = getOutputStream();

pipeline(
  inputStream,
  ...transformStreams,
  outputStream,
  (err) => {
    if (err) {
      console.error('Ooops. Faced an issue', err);
    }
  }
);

function getArgs () {
  const args = {}
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i += 2) {
    let argFlag = argv[i];
    let argValue = argv[i + 1];
    args[argFlag] = argValue;
  }

  return args;
}

function validateArgs() {
  // Config option is required and should be validated. In case of invalid config human-friendly error should be printed in stderr and the process should exit with non-zero status code.
  // If any option is duplicated (i.e. bash $ node my_ciphering_cli -c C1-C1-A-R0 -c C0) then human-friendly error should be printed in stderr and the process should exit with non-zero status code.
  const allowedFlags = [
    '-c', '--config',
    '-i', '--input',
    '-o', '--output'
  ];

  if (!args.hasOwnProperty('-c') && !args.hasOwnProperty('--config')) {
    console.error('Config arg is required!');
    throw Error('Config arg is required!');
  } else if (process.argv.slice(2).length % 2) {
    console.error('Wrong number of arguments!');
    throw Error('Wrong number of arguments!');
  } else if (Object.keys(args).some(x => !allowedFlags.includes(x))) {
    console.error('Wrong passed argument!');
    throw Error('Wrong passed argument!');
  }
}

function getTransformCiphers() {
  const streams = [];

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




function getInputStream() {
  if (isInputFileSpecified()) {
    const inputFilePath = getInputFilePath();
    checkFileAccessibleToRead(inputFilePath);
    return fs.createReadStream(inputFilePath);
  } else {
    return process.stdin;
  }
}

function checkFileAccessibleToRead(filePath) {
  // If the input file is given but doesn't exist or you can't access it
  // (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr
  // and the process should exit with non-zero status code.
  try {
    fs.accessSync(filePath, fs.constants.F_OK | fs.constants.R_OK)
  } catch (err) {
    process.stderr.write(`No permission to read or file is not found: ${filePath}`);
    process.exit(1);
  }
}

function isInputFileSpecified() {
  return args.hasOwnProperty('-i') || args.hasOwnProperty('--input');
}

function getInputFilePath() {
  const inputFileName = args['-i'] || args['--input'];
  return path.join(__dirname, inputFileName);
}















function getOutputStream() {
  if (isOutputFileSpecified()) {
    const outputFilePath = getOutputFilePath();
    checkFileAccessibleToWrite(outputFilePath);
    return fs.createWriteStream(outputFilePath, { flags: 'a' });
  } else {
    return process.stdout;
  }
}

function checkFileAccessibleToWrite(filePath) {
  // If the output file is given but doesn't exist or you can't access it
  // (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr
  // and the process should exit with non-zero status code.
  try {
    fs.accessSync(filePath, fs.constants.F_OK | fs.constants.W_OK)
  } catch (err) {
    process.stderr.write(`No permission to write or file is not found: ${filePath}`);
    process.exit(1);
  }
}

function isOutputFileSpecified() {
  return args.hasOwnProperty('-o') || args.hasOwnProperty('--output');
}

function getOutputFilePath() {
  const outputFileName = args['-o'] || args['--output'];
  return path.join(__dirname, outputFileName);
}