const axios = require('axios')
const HttpCookieAgent = require('http-cookie-agent').HttpCookieAgent
const HttpsCookieAgent = require('http-cookie-agent').HttpsCookieAgent
const tough = require('tough-cookie')
const jar = new tough.CookieJar()

const instance = axios.create({
  baseURL: `${process.env.UNIFI_URI}` || `${process.env.URI}`,
  httpAgent: new HttpCookieAgent({
    jar
  }),
  httpsAgent: new HttpsCookieAgent({
    jar,
    rejectUnauthorized: false
  })
})

module.exports = instance
