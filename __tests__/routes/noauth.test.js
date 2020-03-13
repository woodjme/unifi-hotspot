const request = require('supertest')
const app = require('../../src/server')

describe('get /guest/s/process.env.SITENAME/ with no auth', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
    process.env.AUTH = 'none'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it('should return a 200', async (done) => {
    const res = await request(app)
      .get(`/guest/s/${process.env.SITENAME}/`)
    expect(res.statusCode).toEqual(200)
    done()
  })

  it('should return the noAuth page', async (done) => {
    const res = await request(app)
      .get(`/guest/s/${process.env.SITENAME}/`)
    expect(res.text).toContain('<title>Portal Page - No Auth</title>')
    done()
  })
})
