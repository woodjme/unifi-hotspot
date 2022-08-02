const server = require('./src/server')
const port = process.env.PORT || 4545
// launch
server.listen(port, function (err) {
  if (!err) {
    console.log(`running server on port ${port}`)
  } else {
    console.error(err)
  }
})
