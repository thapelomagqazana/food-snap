const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

/**
 * Preprocess an uploaded image file.
 * @param {string} filePath - Path to the uploaded image file.
 * @returns {tf.Tensor3D} - Preprocessed tensor for classification.
 */
const preprocessImage = (filePath) => {
    const imageBuffer = fs.readFileSync(filePath);
    const decodedImage = tf.node.decodeImage(imageBuffer, 3); // Ensure 3 channels (RGB)
    const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]); // Resize to MobileNet input size
    const normalizedImage = resizedImage.div(255.0); // Normalize pixel values to [0, 1]
    return normalizedImage.expandDims(0); // Add batch dimension
};
  

module.exports = { preprocessImage };
