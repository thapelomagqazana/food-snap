const mobilenet = {
    load: jest.fn(() =>
      Promise.resolve({
        classify: jest.fn(() =>
          Promise.resolve([
            { className: 'Mock Class 1', probability: 0.9 },
            { className: 'Mock Class 2', probability: 0.7 },
          ])
        ),
      })
    ),
};
  
module.exports = mobilenet;
  