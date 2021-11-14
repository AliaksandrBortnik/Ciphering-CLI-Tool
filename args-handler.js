const process = require('process');

const FLAG_ALIAS_GROUPS = [
  ['-c', '--config'],
  ['-i', '--input'],
  ['-o', '--output']
];

module.exports.parseArgs = () => {
  let argv = process.argv.slice(2);
  argv = unifyFlags(argv);
  validateArgs(argv);
  return splitArgsIntoKeyValue(argv);
}

function unifyFlags(args) {
  const longAliases = FLAG_ALIAS_GROUPS.map(g => g[1]);
  return args.map(a => longAliases.includes(a) ?
    FLAG_ALIAS_GROUPS[longAliases.indexOf(a)][0]
    : a);
}

function splitArgsIntoKeyValue(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 2) {
    let argFlag = argv[i];
    let argValue = argv[i + 1];
    args[argFlag] = argValue;
  }

  return args;
}

// Check if any option is duplicated (i.e. bash $ node my_ciphering_cli -c C1-C1-A-R0 -c C0)
function hasArgumentDuplicate(args) {
  const flags = args.filter(a => a.startsWith('-'));
  return new Set(flags).size !== flags.length;
}

function hasConfigFlag(args) {
  return args.includes('-c');
}

function isAllFlagsWithValue(args) {
  return args.length % 2 === 0;
}

function hasUnknownFlags(args) {
  const allowedFlags = [].concat(...FLAG_ALIAS_GROUPS);
  return args.filter(a => a.startsWith('-'))
    .some(x => !allowedFlags.includes(x));
}

function isValidConfig(args) {
  const configValueIndex = args[args.findIndex(a => a === '-c') + 1];
  const ciphers = configValueIndex.split('-');

  if (!ciphers.every(c => ['A', 'C1', 'C0', 'R1', 'R0'].includes(c))) {
    return false;
  }
  return true;
}

function validateArgs(args) {
  let validationMessage = null;

  if (!hasConfigFlag(args)) {
    validationMessage = 'Error: Config argument is required!';
  } else if (!isAllFlagsWithValue(args)) {
    validationMessage = 'Error: Wrong number of arguments!';
  } else if (hasUnknownFlags(args)) {
    validationMessage = 'Error: Unknown passed argument!';
  } else if (hasArgumentDuplicate(args)) {
    validationMessage = 'Error: Duplicate argument has been detected!';
  } else if (!isValidConfig(args)) {
    validationMessage = 'Error: Invalid config. Format must be {XY(-)}n!';
  }

  if (validationMessage) {
    process.stderr.write(validationMessage);
    process.exit(1);
  }
}