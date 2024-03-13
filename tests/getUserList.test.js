const request = require('supertest');
const app = require('../server');

describe('GET /api/users', () => {
  it('should return a list of users', async () => {
    const response = await request(app)
      .get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Add more test cases for specific scenarios, such as empty list, etc.
});