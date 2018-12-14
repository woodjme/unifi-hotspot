// dependencies  ===============================================================
const express = require('express');
const session = require('express-session');
const app = express();

// middleware
app.use(express.static('public'));
app.use(require('express-session')({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

// routes ======================================================================
app.use('/guest/s/default/', require('./src/routes/index.js')());
app.use('/authorise', require('./src/routes/authorise.js')());

// launch ======================================================================
app.listen(4545, function (err) {
  console.log('running server on port 4545');
});
