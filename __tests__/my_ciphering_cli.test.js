const { spawn } = require('child_process');

const BASE_INPUT_TEXT = 'This is secret. Message about "_" symbol!';

describe('Success scenarios', () => {
  // User passes correct sequence of symbols as argument for --config
  test('should work with a valid sequence of config', () => {
    const cp = spawn('node', ['my_ciphering_cli', '-c', 'C1-C0-C1']);
    const DECODED = 'abcd!%';
    const ENCODED = 'bcde!%';
    cp.stdin.write(DECODED);
    cp.stdin.end();

    let outputMessage = '';
    cp.stdout.on('data', data => outputMessage += data.toString());
    cp.stdout.on('end', () => {
      expect(outputMessage).toBe(ENCODED);
    });
    cp.on('exit', code => expect(code).toBe(0));
  })

  // Take cipher usage scenarios from first task description usage examples.
  test('should work fine with cipher usage scenario from first task description', () => {
    const cp = spawn('node', ['my_ciphering_cli', '-c', 'C1-C1-R0-A']);
    const ENCODED = 'Myxn xn nbdobm. Tbnnfzb ferlm "_" nhteru!';
    cp.stdin.write(BASE_INPUT_TEXT);
    cp.stdin.end();

    let outputMessage = '';
    cp.stdout.on('data', data => outputMessage += data.toString());
    cp.stdout.on('end', () => {
      expect(outputMessage).toBe(ENCODED);
    });
    cp.on('exit', code => expect(code).toBe(0));
  });
});

describe('Error scenarios', () => {
  // Input: User passes the same cli argument twice;
  // Result: Error message is shown;
  test('should show error message - duplicate argument', () => {
    const commandArgs = '-c C1-C1-A-R0 -c C0'.split(' ');
    const cp = spawn('node', ['my_ciphering_cli', ...commandArgs]);

    let outputMessage = '';
    cp.stderr.on('data', data => outputMessage += data.toString());
    cp.stderr.on('end', () => {
      expect(outputMessage).toBe('Validation error: Duplicate argument has been detected.\n');
    });
    cp.on('exit', code => expect(code).toBe(1));
  });

  // Input: User doesn't pass -c or --config argument;
  // Result: Error message is shown;
  test('should show error message - no config argument', () => {
    const commandArgs = 'my_ciphering_cli -i "./input.txt"'.split(' ');
    const cp = spawn('node', commandArgs);
    cp.stdin.write(BASE_INPUT_TEXT);
    cp.stdin.end();

    let outputMessage = '';
    cp.stderr.on('data', data => outputMessage += data.toString());
    cp.stderr.on('end', () => {
      expect(outputMessage).toBe('Validation error: Config argument is required.\n');
    });
    cp.on('exit', code => expect(code).toBe(1));
  });

  // Input: User passes -i argument with path that doesn't exist or with no read access;
  // Result: Error message is shown;
  test('should show error message - no input file access or not found', () => {
    const commandArgs = 'my_ciphering_cli -i "./unknown.txt" -c C1-A'.split(' ');
    const cp = spawn('node', commandArgs);
    cp.stdin.write(BASE_INPUT_TEXT);
    cp.stdin.end();

    let outputMessage = '';
    cp.stderr.on('data', data => outputMessage += data.toString());
    cp.stderr.on('end', () => {
      expect(outputMessage).toBe('File error: No permission to read or file is not found.\n');
    });

    cp.on('exit', code =>  {
      expect(code).toBe(1);
    });
  });

  // Input: User passes -o argument with path to directory that doesn't exist or with no read access;
  // Result: Error message is shown;
  test('should show error message - no output file access or not found', () => {
    const commandArgs = 'my_ciphering_cli -o "./unknown/output.txt" -c A'.split(' ');
    const cp = spawn('node', commandArgs);
    cp.stdin.write(BASE_INPUT_TEXT);
    cp.stdin.end();

    let outputMessage = '';
    cp.stderr.on('data', data => outputMessage += data.toString());
    cp.stderr.on('end', () => {
      expect(outputMessage).toBe('File error: No permission to write or file is not found.\n');
    });
    cp.on('exit', code => expect(code).toBe(1));
  });

  // // Input: User passes incorreсt symbols in argument for --config;
  // Result: Error message is shown;
  test('should show error message - unsupported argument', () => {
    const commandArgs = 'my_ciphering_cli -W "abc" -c "R1"'.split(' ');
    const cp = spawn('node', commandArgs);
    cp.stdin.write(BASE_INPUT_TEXT);
    cp.stdin.end();

    let outputMessage = '';
    cp.stderr.on('data', data => outputMessage += data.toString());
    cp.stderr.on('end', () => {
      expect(outputMessage).toBe('Validation error: Unknown argument has been found.\n');
    });
    cp.on('exit', code => expect(code).toBe(1));
  });
});