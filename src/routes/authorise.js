'use strict';
const express = require('express');
const authoriseRouter = express.Router();
const request = require('request');
const username = 'ubnt';
const password = 'password';
const uri = 'https://192.168.0.12:8443';

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
                password: password,
            },
                agentOptions: {
                    rejectUnauthorized: false //Allow Self-signed cert
                }
            }, function(err, response, body){
                console.log(body);
                request({
                    method: 'POST',
                    uri: `${uri}/api/s/default/cmd/stamgr`,
                    json: true,
                    jar: true,
                    body: {
                        cmd: 'authorize-guest',
                        mac: req.session.macAddr,
                    },
                    agentOptions: {
                        rejectUnauthorized: false //Allow Self-signed cert
                    }
                }, function(err, respsonce, body){
                    console.log(body);
                    res.redirect('https://google.co.uk');
                });
            });
        });
    return authoriseRouter;
};
