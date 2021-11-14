const process = require('process');
const ValidationError = require('./Errors/validation-error');

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
    args[argv[i]] = argv[i + 1];
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
  return ciphers.every(c => ['A', 'C1', 'C0', 'R1', 'R0'].includes(c));
}

function validateArgs(args) {
  if (!hasConfigFlag(args)) {
    throw new ValidationError('Config argument is required!');
  } else if (!isAllFlagsWithValue(args)) {
    throw new ValidationError('Wrong number of arguments!');
  } else if (hasUnknownFlags(args)) {
    throw new ValidationError('Unknown passed argument!');
  } else if (hasArgumentDuplicate(args)) {
    throw new ValidationError('Duplicate argument has been detected!');
  } else if (!isValidConfig(args)) {
    throw new ValidationError('Invalid config. Format must be {XY(-)}n!');
  }
}