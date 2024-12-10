const tf = jest.createMockFromModule('@tensorflow/tfjs-node');

tf.node = {
    decodeImage: jest.fn(() => ({
        resizeBilinear: jest.fn(() => ({
            div: jest.fn(() => ({
                expandDims: jest.fn(() => 'mockTensor'), // Mocked final tensor
            })),
        })),
    })),
};

tf.image = {
    resizeBilinear: jest.fn(() => ({
        div: jest.fn(() => ({
            expandDims: jest.fn(() => 'mockTensor'),
        })),
    })),
};

module.exports = tf;
