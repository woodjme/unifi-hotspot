'use strict';
// call depenancies and configs ================================================
const express = require('express');
const session = require('express-session');
const app = express();

// configuration ===============================================================
// Set View engine to ejs
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(require('express-session')({
  secret: 'verySecretKey',
  resave: true,
  saveUninitialized: true
}));

// routes ======================================================================
app.use('/guest/s/default/', require('./src/routes/index.js')());
app.use('/authorise', require('./src/routes/authorise.js')());

// launch ======================================================================
app.listen(80, function (err) {
  if (err) console.log(err);
  console.log('running server on port ' + 80);
});
