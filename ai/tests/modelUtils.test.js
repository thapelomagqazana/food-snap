const axios = require('axios');
const tf = require('@tensorflow/tfjs-node');
const { loadModel, classifyImage } = require('../utils/modelUtils');

jest.mock('axios');
jest.mock('@tensorflow/tfjs-node');

describe('Model Utilities', () => {
    const mockTensor = 'mockTensor';
    let mockModel;

    beforeAll(() => {
        mockModel = {
            predict: jest.fn(() => ({
                dataSync: jest.fn(() => [0.9, 0.8, 0.7]),
            })),
        };
        tf.loadGraphModel = jest.fn(() => Promise.resolve(mockModel));
        axios.get.mockResolvedValue({
            data: {
                0: ['0', 'class0'],
                1: ['1', 'class1'],
                2: ['2', 'class2'],
            },
        });
    });

    it('should load the model successfully', async () => {
        const model = await loadModel();
        expect(model).toBe(mockModel);
        expect(tf.loadGraphModel).toHaveBeenCalled();
    });

    it('should classify an image and return top predictions', async () => {
        const predictions = await classifyImage(mockTensor, mockModel);
        expect(predictions).toEqual([
            { className: 'Class 0', probability: 0.9 },
            { className: 'Class 1', probability: 0.8 },
            { className: 'Class 2', probability: 0.7 },
        ]);
        expect(mockModel.predict).toHaveBeenCalledWith(mockTensor);
    });
});
