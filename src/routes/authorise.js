const express = require('express')
const authoriseRouter = express.Router()
const axios = require('../helpers/axios')
const redirectUrl = process.env.REDIRECTURL || 'https://google.com'

module.exports = function () {
  authoriseRouter.route('/')
    .post(async (req, res) => {
      try {
        await axios.post('/api/login',
          JSON.stringify({
            username: process.env.USERNAME,
            password: process.env.PASSWORD
          }))

        await axios.post(`/api/s/${process.env.SITENAME}/cmd/stamgr`,
          JSON.stringify({
            cmd: 'authorize-guest',
            mac: req.session.macAddr
          }))

        await axios.post('/api/logout')

        res.redirect(redirectUrl)
      } catch (err) {
        console.error(err)
      }
    })
  return authoriseRouter
}
