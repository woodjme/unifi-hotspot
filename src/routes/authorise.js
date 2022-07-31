const express = require('express')
const authoriseRouter = express.Router()
const axios = require('../helpers/axios')
const redirectUrl = process.env.REDIRECTURL || 'http://captive.apple.com/hotspot-detect.html'

module.exports = function () {
  authoriseRouter.route('/')
    .post(async (req, res) => {
      console.log('start')
      console.log(process.env)
      try {
        await axios.post('/api/login',
          JSON.stringify({
            username: process.env.UNIFI_USER,
            password: process.env.UNIFI_PASS
          }))

        await axios.post(`/api/s/${process.env.SITENAME}/cmd/stamgr`,
          JSON.stringify({
            cmd: 'authorize-guest',
            mac: req.session.macAddr
          }))

        // console.log('auth')
        // console.log(authResponse)

        await axios.post('/api/logout')

        res.redirect(redirectUrl)
      } catch (err) {
        res.status(500).json({ err: { message: 'An Error has occoured. Please try again.' } })
        console.error(err)
      }
    })
  return authoriseRouter
}
