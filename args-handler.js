const process = require('process');

module.exports.parseArgs = () => {
  const args = {}
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i += 2) {
    let argFlag = argv[i];
    let argValue = argv[i + 1];
    args[argFlag] = argValue;
  }
  return args;
}

module.exports.validateArgs = (args) => {
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