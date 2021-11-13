const fs = require('fs');
const process = require('process');
const path = require('path');
const { pipeline } = require('stream');

const { getROTNCipherTransform, getAtbashCipherTransform} = require('./cipher');

const args = getArgs();
const cipherQueue = (args['-c'] || args['--config']).split('-');

validateArgs();

const inputStream = getInputStream();
const transformStreams = getTransformCiphers();
const outputStream = getOutputStream();

pipeline(
  inputStream,
  ...transformStreams,
  outputStream,
  (err) => {
    if (err) {
      console.error('Pipeline failed', err);
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
  // Config option is required and should be validated. In case of invalid confing human-friendly error should be printed in stderr and the process should exit with non-zero status code.
  // If any option is duplicated (i.e. bash $ node my_ciphering_cli -c C1-C1-A-R0 -c C0) then human-friendly error should be printed in stderr and the process should exit with non-zero status code.
  const allowedFlags = [
    '-c', '--config', // a config for ciphers
    '-i', '--input', // a path to input file
    '-o', '--output' // a path to output file
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
  } else {
    //console.log('All args look good.')
  }
}

function getInputStream() {
  if (isInputFileSpecified()) {
    const inputFilePath = getInputFilePath();
    // TODO: If the input and/or output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr and the process should exit with non-zero status code.
    return fs.createReadStream(inputFilePath);
  } else {
    return process.stdin;
  }
}

function isInputFileSpecified() {
  return args.hasOwnProperty('-i') || args.hasOwnProperty('--input');
}

function getInputFilePath() {
  const inputFileName = args['-i'] || args['--input'];
  return path.join(__dirname, inputFileName);
}

function getTransformCiphers() {
  const streams = [];

  cipherQueue.forEach(cipherMode => {
    if (cipherMode[0] === 'A') {
      streams.push(getAtbashCipherTransform());
    } else if (cipherMode[0].startsWith('C')) {
      streams.push(getROTNCipherTransform(1, cipherMode[1] === '1'));
    } else if (cipherMode[0].startsWith('R')) {
      streams.push(getROTNCipherTransform(8, cipherMode[1] === '1'));
    }
  });
  return streams;
}

function getOutputStream() {
  if (isOutputFileSpecified()) {
    const outputFilePath = getOutputFilePath();
    // TODO: If the output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory)
    // human-friendly error should be printed in stderr and the process should exit with non-zero status code.
    return fs.createWriteStream(outputFilePath, { flags: 'a' });
  } else {
    return process.stdout;
  }
}

function isOutputFileSpecified() {
  return args.hasOwnProperty('-o') || args.hasOwnProperty('--output');
}

function getOutputFilePath() {
  const outputFileName = args['-o'] || args['--output'];
  return path.join(__dirname, outputFileName);
}