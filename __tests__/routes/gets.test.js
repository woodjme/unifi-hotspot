const request = require('supertest')
const app = require('../../src/server')

describe('get /', () => {
  it('should return a 301', async (done) => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(301)
    done()
  })
})

describe('get randomPage', () => {
  it('should return a 404', async (done) => {
    const res = await request(app)
      .get(`/${Math.floor(Math.random() * 10)}`)
    expect(res.statusCode).toEqual(404)
    done()
  })
})
