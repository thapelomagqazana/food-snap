const request = require('supertest');
const fs = require('fs');
const { classifyImage } = require('../utils/modelUtils');
const { preprocessImage } = require('../utils/imageUtils');
const app = require("../app");

// Mock dependencies
jest.mock('fs');
jest.mock('../utils/modelUtils');
jest.mock('../utils/imageUtils');

// Mock multer to simulate file upload
jest.mock('multer', () => {
    return () => ({
      single: () => (req, res, next) => {
        if (req.headers['mock-upload'] === 'true') {
          req.file = {
            buffer: Buffer.from('mocked-image-data'),
            originalname: 'mock-file.jpg',
            mimetype: 'image/jpeg',
            path: 'mock-path',
          };
        } else {
          req.file = undefined; // Simulate no file uploaded
        }
        next();
      },
    });
});
  

describe('POST /classify', () => {
  beforeAll(() => {
    classifyImage.mockResolvedValue([
      { className: 'Mock Food', probability: 0.9 },
    ]);
    preprocessImage.mockReturnValue('mocked-tensor');
  });

  it('should return predictions for a valid image', async () => {
    const response = await request(app)
      .post('/classify')
      .set('mock-upload', 'true') // Enable mock file upload
      .attach('image', Buffer.from('mock-image-data'), {
        filename: 'test.jpg',
        contentType: 'image/jpeg',
      });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Image classified successfully.');
    expect(response.body.predictions).toEqual([
      { className: 'Mock Food', probability: 0.9 },
    ]);
  });
  

  it('should return 400 if no image is uploaded', async () => {
    const response = await request(app)
      .post('/classify') // No file uploaded
      .set('mock-upload', 'false'); // Explicitly disable mock file upload
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No image uploaded.');
  });
});
