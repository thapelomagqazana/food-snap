const { loadModel } = require('../utils/modelUtils');
const mobilenet = require('@tensorflow-models/mobilenet');

jest.mock('@tensorflow-models/mobilenet'); // Mock the entire module

describe('modelUtils', () => {
  it('should load the MobileNet model', async () => {
    const model = await loadModel();

    expect(mobilenet.load).toHaveBeenCalled();
    expect(model).toBeDefined();
    expect(model.classify).toBeDefined(); // Ensure the mocked classify method is present
  });

  it('should classify an image tensor', async () => {
    const model = await loadModel();
    const mockImageTensor = {}; // Mock image tensor
    const predictions = await model.classify(mockImageTensor);

    expect(model.classify).toHaveBeenCalledWith(mockImageTensor);
    expect(predictions).toBeDefined();
    expect(predictions).toHaveLength(2); // Check for the length of predictions
    expect(predictions[0].className).toBe('Mock Class 1');
    expect(predictions[0].probability).toBeCloseTo(0.9, 1);
  });
});
