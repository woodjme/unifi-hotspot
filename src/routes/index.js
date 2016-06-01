'use strict';
const express = require('express');
const indexRouter = express.Router();

module.exports = function () {
    indexRouter.route('/')
    .get(function(req, res){
       res.send("It Works!"); 
    });
 return indexRouter;   
};
