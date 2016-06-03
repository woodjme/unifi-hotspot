'use strict';
const express = require('express');
const indexRouter = express.Router();

module.exports = function () {
    indexRouter.route('/')
    .get(function(req, res){
    res.render('./index.ejs');
       console.log(req.query);
    });
 return indexRouter;   
};
