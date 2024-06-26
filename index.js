const server = require('./src/server')
const port = process.env.PORT || 4545
// launch
server.listen(port, function (err) {
  if (!err) {
    console.log('V3 with breaking changes is coming soon, please pin to v2 or upgrade to v3 when ready.')
    console.log(`running server on port ${port}`)
  } else {
    console.error(err)
  }
})
