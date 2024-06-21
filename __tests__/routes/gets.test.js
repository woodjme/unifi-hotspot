const request = require('supertest');
const app = require('../../src/server');

describe('get /', () => {
  it('should return a 301', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(301);
  });
});

describe('get randomPage', () => {
  it('should return a 404', async () => {
    const res = await request(app).get(`/${Math.floor(Math.random() * 10)}`);
    expect(res.statusCode).toEqual(404);
  });
});
