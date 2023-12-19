const server = require('./src/server')
const port = process.env.PORT || 4545

const requiredEnvVars = [
  'UNIFI_URI',
  'UNIFI_USER',
  'UNIFI_PASS'
  // 'UNIFI_SITENAME'
]

// check for required env vars
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
})

// launch
server.listen(port, function (err) {
  if (!err) {
    console.log(`running server on port ${port}`)
  } else {
    console.error(err)
  }
})
