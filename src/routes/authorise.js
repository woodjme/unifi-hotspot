'use strict';
const express = require('express');
const authoriseRouter = express.Router();
const request = require('request');

console.log();
module.exports = function () {
    authoriseRouter.route('/')
        .post(function (req, res) {
            request({
                method: 'POST',
                uri: `${process.env.uri}/api/login`,
                json: true,
                jar: true,
                body: {
                    username: process.env.username,
                    password: process.env.password
                },
                agentOptions: {
                    rejectUnauthorized: false //Allow Self-signed cert
                }
            }, function (err, response, body) {
                if (err) { console.log(err.stack); }
                console.log(body);
                request({
                    method: 'POST',
                    uri: `${process.env.uri}/api/s/${process.env.sitename}/cmd/stamgr`,
                    json: true,
                    jar: true,
                    body: {
                        cmd: 'authorize-guest',
                        mac: req.session.macAddr
                    },
                    agentOptions: {
                        rejectUnauthorized: false //Allow Self-signed cert
                    }
                }, function (err, response, body) {
                    if (err) { console.log(err.stack); }
                    console.log(body);
                    res.redirect('https://google.co.uk');
                    request({
                        method: 'POST',
                        uri: `${process.env.uri}/logout`,
                        jar: true,
                        agentOptions: {
                            rejectUnauthorized: false //Allow Self-signed cert
                        }
                    }, function (err, response, body) {
                        if (err) { console.log(err.stack); }
                        console.log(body);
                    });
                });
            });
        });
    return authoriseRouter;
};
