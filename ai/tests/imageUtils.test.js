const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { preprocessImage } = require('../utils/imageUtils');

jest.mock('@tensorflow/tfjs-node'); // Use the mock for TensorFlow.js

describe('Image Preprocessing', () => {
    const mockFilePath = 'test-image.jpg';

    beforeAll(() => {
        fs.writeFileSync(mockFilePath, 'dummy content'); // Create a dummy image file
        tf.node.decodeImage.mockReturnValue({
            resizeBilinear: jest.fn(() => ({
                div: jest.fn(() => ({
                    expandDims: jest.fn(() => 'mockTensor'),
                })),
            })),
        });
    });

    afterAll(() => {
        fs.unlinkSync(mockFilePath); // Clean up the dummy file
    });

    it('should preprocess the image and return a tensor', () => {
        const tensor = preprocessImage(mockFilePath);

        // Validate the output and function calls
        expect(tensor).toBe('mockTensor'); // Final tensor
        expect(tf.node.decodeImage).toHaveBeenCalledWith(expect.any(Buffer), 3); // Ensure RGB channels
        expect(tf.image.resizeBilinear).toHaveBeenCalledWith(expect.any(Object), [224, 224]); // Resize
        // expect(tf.node.decodeImage().resizeBilinear().div).toHaveBeenCalledWith(255.0); // Normalize
        // expect(tf.node.decodeImage().resizeBilinear().div().expandDims).toHaveBeenCalledWith(0); // Add batch dimension
    });
});
