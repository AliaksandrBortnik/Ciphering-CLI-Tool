// Ciphering CLI Tool. CLI tool that will encode and decode a text by 3 substitution ciphers.
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/*
$ node my_ciphering_cli -c "C1-C1-R0-A" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt Myxn xn nbdobm. Tbnnfzb ferlm "_" nhteru!

$ node my_ciphering_cli -c "C1-C0-A-R1-R0-A-R0-R0-C1-A" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt Vhgw gw wkmxkv. Ckwwoik onauv "_" wqcnad!

$ node my_ciphering_cli -c "A-A-A-R1-R0-R0-R0-C1-C1-A" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt Hvwg wg gsqfsh. Asggous opcih "_" gmapcz!

$ node my_ciphering_cli -c "C1-R1-C0-C0-A-R0-R1-R1-A-C1" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt This is secret. Message about "_" symbol!
*/

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
  const allowedFlags = [
    '-c',
    '--config',
    '-i',
    '--input',
    '-o',
    '--output'
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

const args = getArgs();
validateArgs();
let textToEncode;

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

function outputResult(textToEncode) {
  if (args.hasOwnProperty('-o') || args.hasOwnProperty('--output')) {
    const outputFileName = args['-o'] || args['--output'];
    const outputFilePath = path.join(__dirname, outputFileName);

    fs.writeFile(outputFilePath, textToEncode, err => {
      console.log('Successfully wrote to the file.')
    });
  } else { // If the output file option is missed - use stdout as an output destination.
    // TODO: process encode/decode and overwrite textToEncode
    process.stdout.write(`The result of processing: ${textToEncode}`);
    process.stdout.write('\n');
  }
}

// Caesar cipher
function processCaesarCipher(isEncoding = true) {

}

// Atbash cipher
function processAtbashCipher() { // Atbash always symetric encoding <-> decoding

}

// ROT-8 as variation of ROT-13
function processROT8(isEncoding = true) {

}



// If the input and/or output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr and the process should exit with non-zero status code.

// CLI tool should accept 3 options (short alias and full name):
// -c, --config: config for ciphers Config is a string with pattern {XY(-)}n, where:
// X is a cipher mark:
// C is for Caesar cipher (with shift 1)
// A is for Atbash cipher
// R is for ROT-8 cipher
// Y is flag of encoding or decoding (mandatory for Caesar cipher and ROT-8 cipher and should not be passed Atbash cipher)
// 1 is for encoding
// 0 is for decoding
// -i, --input: a path to input file
// -o, --output: a path to output file
// For example, config "C1-C1-R0-A" means "encode by Caesar cipher => encode by Caesar cipher => decode by ROT-8 => use Atbash"

// Config option is required and should be validated. In case of invalid confing human-friendly error should be printed in stderr and the process should exit with non-zero status code.
// If any option is duplicated (i.e. bash $ node my_ciphering_cli -c C1-C1-A-R0 -c C0) then human-friendly error should be printed in stderr and the process should exit with non-zero status code.
// If the input and/or output file is given but doesn't exist or you can't access it (e.g. because of permissions or it's a directory) - human-friendly error should be printed in stderr and the process should exit with non-zero status code.
// If passed params are fine the output (file or stdout) should contain transformed content of input (file or stdin).
// For encoding/decoding use only the English alphabet, all other characters should be kept untouched.
// Using streams for reading, writing and transformation of text is mandatory.
// Each cipher is implemented in the form of a transform stream.
// Streams are piped inside each other according to config (you can use .pipe streams instances method or pipeline)