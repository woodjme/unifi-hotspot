const server = require('./src/server')
const port = process.env.PORT || 4545

const requiredEnvVars = [
  'UNIFI_USER',
  'UNIFI_PASS'
]

// Check for URI or UNIFI_URI
const uriVar = process.env.UNIFI_URI || process.env.URI
if (!uriVar) {
  console.error('Missing required environment variable: UNIFI_URI (or deprecated URI)')
  process.exit(1)
}
if (process.env.URI) {
  console.warn('Warning: The URI environment variable is deprecated and will be removed in the future. Please use UNIFI_URI instead.')
}

// Check for SITENAME or UNIFI_SITENAME
const sitenameVar = process.env.UNIFI_SITENAME || process.env.SITENAME
if (!sitenameVar) {
  console.error('Missing required environment variable: UNIFI_SITENAME (or deprecated SITENAME)')
  process.exit(1)
}
if (process.env.SITENAME) {
  console.warn('Warning: The SITENAME environment variable is deprecated and will be removed in the future. Please use UNIFI_SITENAME instead.')
}


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
