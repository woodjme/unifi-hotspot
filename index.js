const server = require('./src/server')

// launch ======================================================================
server.listen(4545, function (err) {
  if (!err) {
    console.log('running server on port 4545')
  } else {
    console.error(err)
  }
})
