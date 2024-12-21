const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');

let model;

/**
 * Load the MobileNet model.
 */
const loadModel = async () => {
  try {
    console.log('Loading MobileNet model...');
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log('MobileNet model loaded successfully.');
    return model;
  } catch (error) {
    console.error('Error loading MobileNet model:', error.message);
  }
};

/**
 * Classify an image tensor using the loaded model.
 * @param {tf.Tensor3D} imageTensor - The image tensor to classify.
 * @returns {Array} - Predictions with class names and probabilities.
 */
const classifyImage = async (imageTensor) => {
  await loadModel();
  if (!model) {
    throw new Error('Model is not loaded.');
  }
  return await model.classify(imageTensor);
};

module.exports = { loadModel, classifyImage };
