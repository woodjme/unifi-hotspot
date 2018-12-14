const express = require('express');
const authoriseRouter = express.Router();
const request = require('request-promise');
module.exports = function () {
    authoriseRouter.route('/')
    let requestOptions = ({
        method: 'POST',
        jar: true,
        json: true,
        strictSSL: false,
        uri: "",
        body: {}
    });
    .post(function (req, res) {
        requestOptions.uri = `${process.env.URI}/api/login`;
        requestOptions.body = {
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        };
        request(requestOptions)
            .then(loginResp => {
                requestOptions.uri = `${process.env.URI}/api/s/${process.env.SITENAME}/cmd/stamgr`;
                requestOptions.body = {
                    cmd: 'authorize-guest',
                    mac: "00-14-22-01-23-45"
                };
                return request(requestOptions);
            })
            .then(authResp => {
                console.log(authResp);
                requestOptions.uri = `${process.env.URI}/api/logout`;
                return request(requestOptions);
            })
            .then(logoutResp => {
                res.redirect('https://google.co.uk');
            })
            .catch(err => {
                console.log(err);
            })
    });
    return authoriseRouter;
};