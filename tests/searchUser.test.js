const request = require('supertest');
const app = require('../server');

describe('GET /api/users/search', () => {
  it('should search a user by username', async () => {
    const username = 'testuser'; // Provide a valid username to search

    const response = await request(app)
      .get(`/api/users/search?username=${username}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(username);
  });

  // Add more test cases for searching by ID, error handling, etc.
});