const getTransformCiphers = require('../transforms/transform-builder');
const parseCipherQueue = require('../transforms/parse-cipher-queue');

// The mock factory returns a mocked function
jest.mock('../transforms/parse-cipher-queue', () => jest.fn());

describe('Receiving transforms with mock', () => {

  afterEach(() => {
    parseCipherQueue.mockRestore();
  })

  test('should return 6 transforms', () => {
    // Override mock created by a mock factory
    parseCipherQueue.mockReturnValue(['A', 'C0', 'C1', 'A', 'R1', 'A']);

    const configArgs = { '-c': 'A-C0-C1-A-R1-A' };
    const transformsCount = getTransformCiphers(configArgs).length;

    expect(parseCipherQueue).toHaveBeenCalledWith(configArgs);
    expect(parseCipherQueue).toHaveBeenCalledTimes(1);
    expect(transformsCount).toBe(6);
  });

  test('should return 1 transform', () => {
    // Override mock created by a mock factory
    parseCipherQueue.mockReturnValue(['A']);

    const configArgs = { '-c': 'A' };
    const transformsCount = getTransformCiphers(configArgs).length;

    expect(parseCipherQueue).toHaveBeenCalledWith(configArgs);
    expect(parseCipherQueue).toHaveBeenCalledTimes(1);
    expect(transformsCount).toBe(1);
  });

  test('should return 7 transform', () => {
    // Override mock created by a mock factory
    parseCipherQueue.mockReturnValue(['C1', 'C0', 'R1', 'R0', 'A', 'A', 'A']);

    const configArgs = { '-c': 'C1-C0-R1-R0-A-A-A' };
    const transformsCount = getTransformCiphers(configArgs).length;

    expect(parseCipherQueue).toHaveBeenCalledWith(configArgs);
    expect(parseCipherQueue).toHaveBeenCalledTimes(1);
    expect(transformsCount).toBe(7);
  });
})