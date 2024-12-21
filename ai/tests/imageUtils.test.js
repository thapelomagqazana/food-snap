const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { preprocessImage } = require('../utils/imageUtils');

jest.mock('fs');
jest.mock('@tensorflow/tfjs-node');

describe('preprocessImage', () => {
  it('should preprocess the image and return a tensor', () => {
    fs.readFileSync.mockReturnValue(Buffer.from('mocked-image-data'));

    const result = preprocessImage('mock-path');
    expect(result).toBe('mocked-resized-tensor');
    expect(tf.node.decodeImage).toHaveBeenCalled();
  });
});
