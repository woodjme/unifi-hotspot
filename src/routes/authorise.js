'use strict';
const express = require('express');
const authoriseRouter = express.Router();

module.exports = function () {
    authoriseRouter.route('/')
        .post(function (req, res) {
            res.send('test');
            console.log(req.session);
        });
    return authoriseRouter;
};
