'use strict';
const express = require('express');
const authoriseRouter = express.Router();
const request = require('request');
const username = 'ubnt';
const password = 'password';
const uri = 'https://192.168.0.12:8443';
const sitename = 'default';

module.exports = () => {
    authoriseRouter.route('/')
        .post( (req, res) =>{
            request({
                method: 'POST',
                uri: `${uri}/api/login`, //Log into API
                json: true,
                jar: true,
                body: {
                    username: username,
                    password: password,
                },
                agentOptions: {
                    rejectUnauthorized: false //Allow Self-signed cert
                }
            }, (err, response, body) => {
                console.log(body);
                request({
                    method: 'POST',
                    uri: `${uri}/api/s/${sitename}/cmd/stamgr`, //Authenticate User
                    json: true,
                    jar: true,
                    body: {
                        cmd: 'authorize-guest',
                        mac: req.session.macAddr,
                    },
                    agentOptions: {
                        rejectUnauthorized: false //Allow Self-signed cert
                    }
                },  (err, response, body) => {
                    console.log(body);
                    res.redirect('https://google.co.uk');
                    request({
                        method: 'POST',
                        uri: `${uri}/logout`, //Logout of API
                        jar: true,
                        agentOptions: {
                            rejectUnauthorized: false //Allow Self-signed cert
                        }
                    },  (err, response, body) => {
                        console.log(body);
                    });
                });
            });
        });
    return authoriseRouter;
};
