const express = require('express')
const authoriseRouter = express.Router()
const axios = require('../helpers/axios')
const redirectUrl = process.env.REDIRECTURL || 'https://google.com'
const logAuthDrivers = require('../helpers/logAuthDrivers')

module.exports = function () {
  authoriseRouter.route('/')
    .post(async (req, res) => {
      try {
        await unifiLogin()
        if (process.env.LOG_AUTH_DRIVER) {
          await logAuth(req.body)
        }
        await unifiDeviceAuthorisation(req)
        res.redirect(redirectUrl)
        await unifiLogout()
      } catch (err) {
        res.status(500).json({ err: { message: 'An Error has occoured. Please try again.' } })
        console.error(err)
      }
    })
  return authoriseRouter
}

// Unifi Login
const unifiLogin = async () => {
  try {
    const loginResponse = await axios.post('/api/login',
      JSON.stringify({
        username: process.env.UNIFI_USER,
        password: process.env.UNIFI_PASS
      }))
    console.log(loginResponse.data)
    if (loginResponse.data.meta.rc === 'ok') {
      console.log('Unifi Login Successful')
      return loginResponse
    }
  } catch (err) {
    console.error(err)
    throw new Error('Unifi Login Failed')
  }
}

// Unifi Device Authorisation
const unifiDeviceAuthorisation = async (req) => {
  try {
    const deviceAuthorisation = await axios.post(`/api/s/${process.env.SITENAME}/cmd/stamgr`,
      JSON.stringify({
        cmd: 'authorize-guest',
        mac: req.session.macAddr
      }))
    if (deviceAuthorisation.data.meta.rc === 'ok') {
      console.log('Unifi Device Authorisation Successful')
      console.log(deviceAuthorisation.data)
      return deviceAuthorisation
    }
  } catch (err) {
    console.error(err)
    throw new Error('Unifi Device Authorisation Failed')
  }
}

// Unifi Logout
const unifiLogout = async () => {
  try {
    const logoutResponse = await axios.post('/api/logout')
    if (logoutResponse.data.meta.rc === 'ok') {
      console.log('Unifi Logout Successful')
      return logoutResponse
    }
  } catch (err) {
    console.error(err)
    throw new Error('Unifi Logout Failed')
  }
}

// Handle LogAuth
const logAuth = async (formData) => {
  switch (process.env.LOG_AUTH_DRIVER) {
    case 'webhook':
      return await logAuthDrivers.webhook(formData)
    case 'googlesheets':
      return await logAuthDrivers.googleSheets(formData)
    default:
      return null
  }
}
