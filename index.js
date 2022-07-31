const server = require('./src/server')

// launch
server.listen(80, function (err) {
  if (!err) {
    console.log('running server on port 4545')
  } else {
    console.error(err)
  }
})
