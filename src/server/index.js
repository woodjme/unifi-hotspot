const express = require('express')
const server = express()
const bodyParser = require('body-parser')

// middleware
server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }))
server.use(require('express-session')({
  secret: process.env.SECRET || 'secret',
  resave: true,
  saveUninitialized: true
}))

// routes
server.get('/', (req, res) => {
  res.redirect(301, `/guest/s/${process.env.SITENAME}/`)
})
server.use(`/guest/s/${process.env.SITENAME}/`, require('../routes/index.js')())
server.use('/authorise', require('../routes/authorise.js')())
module.exports = server
