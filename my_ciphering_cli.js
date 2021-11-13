// Using streams for reading, writing and transformation of text is mandatory.
// Each cipher is implemented in the form of a transform stream.
// Streams are piped inside each other according to config (you can use .pipe streams instances method or pipeline)
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const cipher = require('./cipher');

const args = getArgs();
const cipherQueue = (args['-c'] || args['--config']).split('-');
let text;

validateArgs();
processText();

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

function processText() {
  if (args.hasOwnProperty('-i') || args.hasOwnProperty('--input')) {
    const inputFileName = args['-i'] || args['--input'];
    const inputFilePath = path.join(__dirname, inputFileName);

    // TODO: If the input and/or output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr and the process should exit with non-zero status code.
    fs.readFile(inputFilePath, 'utf-8', (err, content) => {
      text = content;
      applyCiphers()
      outputResult();
    });
  } else { // If the input file option is missed - use stdin as an input source.
    const rl = readline.createInterface(({
      input: process.stdin, // the readable stream to listen to (Required).
      output: process.stdout, //  the writable stream to write readline data to (Optional).
      terminal: false // pass true if the input and output streams should be treated like a TTY, and have ANSI/VT100 escape codes written to it. Defaults to checking isTTY on the output stream upon instantiation.
    }));

    rl.question('What text would you like to process?\n', line => {
      text = line;
      applyCiphers()
      outputResult();
      rl.close();
    });
  }
}

function applyCiphers() {
  cipherQueue.forEach(cipherMode => {
    if (cipherMode[0] === 'A') {
      text = cipher.processAtbashCipher(text);
    } else if (cipherMode[0].startsWith('C')) {
      text = cipher.processROTN(text, 1, cipherMode[1] === '1')
    } else if (cipherMode[0].startsWith('R')) {
      text = cipher.processROTN(text, 8, cipherMode[1] === '1')
    }
  });
}

function outputResult() {
  if (args.hasOwnProperty('-o') || args.hasOwnProperty('--output')) {
    const outputFileName = args['-o'] || args['--output'];
    const outputFilePath = path.join(__dirname, outputFileName);

    // TODO: If the input and/or output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr and the process should exit with non-zero status code.
    fs.writeFile(outputFilePath, text, err => {
      console.log('Successfully wrote to the file.')
    });
  } else { // If the output file option is missed - use stdout as an output destination.
    process.stdout.write(`The result of processing: ${text}\n`);
  }
}