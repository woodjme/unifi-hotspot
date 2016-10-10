'use strict';
const express = require('express');
const authoriseRouter = express.Router();
const request = require('request');
const username = 'ubnt';
const password = 'password';
const uri = 'https://192.168.0.12:8443';
const sitename = 'default';

module.exports = function () {
    authoriseRouter.route('/')
        .post(function (req, res) {
            request({
                method: 'POST',
                uri: `${uri}/api/login`,
                json: true,
                jar: true,
                body: {
                    username: username,
                    password: password
                },
                agentOptions: {
                    rejectUnauthorized: false //Allow Self-signed cert
                }
            }, function (err, response, body) {
                if (err) { console.log(err.stack); }
                console.log(body);
                request({
                    method: 'POST',
                    uri: `${uri}/api/s/${sitename}/cmd/stamgr`,
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
                        uri: `${uri}/logout`,
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
