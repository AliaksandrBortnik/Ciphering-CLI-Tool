// Using streams for reading, writing and transformation of text is mandatory.
// Each cipher is implemented in the form of a transform stream.
// Streams are piped inside each other according to config (you can use .pipe streams instances method or pipeline)

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const alphabetReversed = 'zyxwvutsrqponmlkjihgfedcba'.split('');
const alphabetUpperReversed = 'ZYXWVUTSRQPONMLKJIHGFEDCBA'.split('');

const args = getArgs();
const cipherQueue = (args['-c'] || args['--config']).split('-');
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
  // CLI tool should accept 3 options (short alias and full name):
  // -c, --config: config for ciphers Config is a string with pattern {XY(-)}n, where:
  // X is a cipher mark:
  // C is for Caesar cipher (with shift 1)
  // A is for Atbash cipher
  // R is for ROT-8 cipher
  // Y is flag of encoding or decoding (mandatory for Caesar cipher and ROT-8 cipher and should not be passed Atbash cipher)
  // 1 is for encoding
  // 0 is for decoding

  // Config option is required and should be validated. In case of invalid confing human-friendly error should be printed in stderr and the process should exit with non-zero status code.
  // If any option is duplicated (i.e. bash $ node my_ciphering_cli -c C1-C1-A-R0 -c C0) then human-friendly error should be printed in stderr and the process should exit with non-zero status code.
  // If the input and/or output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr and the process should exit with non-zero status code.

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

    fs.readFile(inputFilePath, 'utf-8', (err, content) => {
      outputResult(content);
    });
  } else { // If the input file option is missed - use stdin as an input source.
    const rl = readline.createInterface(({
      input: process.stdin, // the readable stream to listen to (Required).
      output: process.stdout, //  the writable stream to write readline data to (Optional).
      terminal: false // pass true if the input and output streams should be treated like a TTY, and have ANSI/VT100 escape codes written to it. Defaults to checking isTTY on the output stream upon instantiation.
    }));

    rl.question('What text would you like to process?\n', line => {
      outputResult(line);
      rl.close();
    });
  }
}

function outputResult(text) {
  if (args.hasOwnProperty('-o') || args.hasOwnProperty('--output')) {
    const outputFileName = args['-o'] || args['--output'];
    const outputFilePath = path.join(__dirname, outputFileName);

    fs.writeFile(outputFilePath, text, err => {
      console.log('Successfully wrote to the file.')
    });
  } else { // If the output file option is missed - use stdout as an output destination.
    cipherQueue.forEach(cihper => {
      if (cipher[0] === 'A') {
        text = processAtbashCipher(text);
      } else if (cipher[0].startsWith('C')) {
        text = processCaesarCipher(text, cipher[1] === '1')
      } else if (cipher[0].startsWith('R')) {
        text = processROT8(text, cipher[1] === '1')
      }
    });

    process.stdout.write(`The result of processing: ${text}\n`);
  }
}

function processCaesarCipher(text, isEncoding) {
  return processROTN(text, 1, isEncoding);
}

function processROT8(text, isEncoding) {
  return processROTN(text, 8, isEncoding);
}

function processAtbashCipher(text) {
  return text.split('')
    .map(l => {
      return !isEnglishLetter(l) ? l
        : l === l.toUpperCase() ?
          alphabetUpper[alphabetUpperReversed.indexOf(l)]
          : alphabet[alphabetReversed.indexOf(l)];
    })
    .join('');
}

function processROTN(text, shiftN, isEncoding = true) {
  const shift = isEncoding ? shiftN : -shiftN;
  return text.split('')
    .map(l => !isEnglishLetter(l) ? l
      : shiftAlphabetLetter(l === l.toUpperCase() ? alphabetUpper : alphabet, l, shift))
    .join('');
}

function isEnglishLetter(char) {
  return char && char.length === 1 && /[a-z]/i.test(char);
}

function shiftAlphabetLetter(alphabet, letter, shift) {
  return alphabet[(alphabet.indexOf(letter) + shift) % 26]
}