const request = require('supertest');
const express = require('express');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Simulated route to trigger an error
app.get('/error', (req, res) => {
    throw new Error('Simulated error');
});

// Integrate error-handling middleware
app.use(errorHandler);

describe('Error Handler Middleware', () => {
    it('should return a 500 status and error message for a thrown error', async () => {
        const response = await request(app).get('/error');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Simulated error');
        if (process.env.NODE_ENV === 'development') {
            expect(response.body).toHaveProperty('stack');
        } else {
            expect(response.body).not.toHaveProperty('stack');
        }
    });
});
