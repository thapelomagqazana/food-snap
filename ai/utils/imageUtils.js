const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");

/**
 * Reads and preprocesses an image file for TensorFlow.js.
 * @param {string} filePath - Path to the image file.
 * @returns {tf.Tensor} - Preprocessed tensor for the model.
 */
const preprocessImage = (filePath) => {
    const imageBuffer = fs.readFileSync(filePath);
    const decodedImage = tf.node.decodeImage(imageBuffer, 3); // Ensure RGB channels
    const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]); // Resize to MobileNet input size
    const normalizedImage = resizedImage.div(255.0); // Normalize pixel values to [0, 1]
    const expandedImage = normalizedImage.expandDims(0); // Add batch dimension
    return expandedImage;
};

module.exports = { preprocessImage };