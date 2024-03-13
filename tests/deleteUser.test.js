const request = require('supertest');
const app = require('../server');

describe('DELETE /api/users/:id', () => {
  it('should delete a user', async () => {
    const userId = 'USER_ID'; // Provide a valid user ID

    const response = await request(app)
      .delete(`/api/users/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

  // Add more test cases for error handling, etc.
});