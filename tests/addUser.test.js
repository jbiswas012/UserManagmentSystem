const request = require('supertest');
const app = require('../server');

describe('POST /api/users', () => {
  it('should add a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      role: 'regular'
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('User added successfully');
  });

  // Add more test cases for validation, error handling, etc.
});