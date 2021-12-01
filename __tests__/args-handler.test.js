const { parseArgs } = require("../args-handler");
const ValidationError = require("../errors/validation-error");

describe('Arg parsing with validation', function () {
  test('-c "A" should be parsed well', () => {
    const args = ['-c', 'A'];
    const parsedArgs = parseArgs(args);
    expect(parsedArgs).toEqual({
      '-c': 'A'
    });
  });

  test('-i "./input.txt" should throw error due to lack of the cipher config', () => {
    const args = ['-i', './input.txt'];
    expect(() => parseArgs(args))
      .toThrow(new ValidationError('Config argument is required.'));
  });

  test('--config "A" -i -o "./output.txt" should throw error due to missed argument', () => {
    const args = ['--config', 'A', '-i', '-o', './output.txt'];
    expect(() => parseArgs(args))
      .toThrow(new ValidationError('Wrong number of arguments.'));
  });

  test('-c "A" -d "Unknown" should throw error due to unsupported argument', () => {
    const args = ['-c', 'A', '-d', 'Unknown'];
    expect(() => parseArgs(args))
      .toThrow(new ValidationError('Unknown argument has been found.'));
  });

  test('-c "A" -c "C1-C0" should throw error due to duplicated argument', () => {
    const args = ['-c', 'A', '-c', 'C1-C0'];
    expect(() => parseArgs(args))
      .toThrow(new ValidationError('Duplicate argument has been detected.'));
  });

  test('-c "AAA-C1" should throw error due to invalid config setup', () => {
    const args = ['-c', 'AAA-C1'];
    expect(() => parseArgs(args))
      .toThrow(new ValidationError('Invalid config. Format must be {XY(-)}n.'));
  });
});