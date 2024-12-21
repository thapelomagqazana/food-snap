const tf = {
    node: {
      decodeImage: jest.fn(() => ({
        div: jest.fn(() => ({
          expandDims: jest.fn(() => 'mocked-tensor'),
        })),
      })),
    },
    image: {
      resizeBilinear: jest.fn(() => ({
        div: jest.fn(() => ({
          expandDims: jest.fn(() => 'mocked-resized-tensor'),
        })),
      })),
    },
  };
  
  module.exports = tf;
  