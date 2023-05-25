const request = require('supertest');
const app = require('../../src/app');

describe('/ Invalid endpoint', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/hello');
    expect(res.status).toBe(404);
  });
});