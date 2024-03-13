const request = require('supertest');
const app = require('../server');

describe('PUT /api/users/:id', () => {
  it('should update a user', async () => {
    const userId = 'USER_ID'; // Provide a valid user ID
    const updatedUser = {
      username: 'updatedusername',
      email: 'updated@example.com',
      role: 'admin'
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });

  // Add more test cases for validation, error handling, etc.
});