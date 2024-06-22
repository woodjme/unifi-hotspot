const request = require('supertest');
const app = require('../../src/server');

describe('get /guest/s/process.env.UNIFI_SITENAME/ with basic auth', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
    };
    delete process.env.NODE_ENV;
    process.env.AUTH = 'basic';
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should return a 200', async () => {
    const res = await request(app).get(
      `/guest/s/${process.env.UNIFI_SITENAME}/`,
    );
    expect(res.statusCode).toEqual(200);
  });

  it('should return the noAuth page', async () => {
    const res = await request(app).get(
      `/guest/s/${process.env.UNIFI_SITENAME}/`,
    );
    expect(res.text).toContain('<title>Portal Page - Basic Auth</title>');
  });
});
