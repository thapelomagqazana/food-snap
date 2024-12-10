const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');

let classNames = {};

/**
 * Fetches ImageNet class names from a remote URL.
 * @returns {Promise<void>}
 */
const fetchClassNames = async () => {
    try {
        const response = await axios.get('https://storage.googleapis.com/download.tensorflow.org/data/imagenet_class_index.json');
        const data = response.data;
        classNames = Object.fromEntries(Object.entries(data).map(([key, value]) => [parseInt(key), value[1]]));
        console.log('Class names fetched successfully');
    } catch (error) {
        console.error('Error fetching class names:', error.message);
    }
};

// Fetch the class names before running predictions
fetchClassNames();

/**
 * Loads the pre-trained MobileNet model.
 * @returns {Promise<tf.GraphModel>} - The loaded TensorFlow.js model.
 */
const loadModel = async () => {
    const modelUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
    return await tf.loadGraphModel(modelUrl);
};

/**
 * Runs predictions on a preprocessed image.
 * @param {tf.Tensor} imageTensor - Preprocessed image tensor.
 * @param {tf.GraphModel} model - Loaded TensorFlow.js model.
 * @returns {Array} - Top 5 predictions.
 */
const classifyImage = async (imageTensor, model) => {
    const predictions = model.predict(imageTensor);
    const top5 = Array.from(predictions.dataSync())
        .map((value, index) => ({ index, probability: value }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5);

    return top5.map(({ index, probability }) => ({
        className: classNames[index] || `Class ${index}`, // Use classNames mapping
        probability,
    }));
};

module.exports = { loadModel, classifyImage, fetchClassNames };
