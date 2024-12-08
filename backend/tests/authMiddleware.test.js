const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/authMiddleware');

describe('Authentication Middleware', () => {
    it('should call next() for valid token', () => {
        const req = {
            header: jest.fn().mockReturnValue('Bearer validtoken'),
        };
        const res = {};
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: 'user123' }));

        authenticate(req, res, next);

        expect(req.user).toEqual({ id: 'user123' });
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
        const req = { header: jest.fn().mockReturnValue(null) };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });

    it('should return 403 for invalid token', () => {
        const req = { header: jest.fn().mockReturnValue('Bearer invalidtoken') };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token.' });
    });
});
