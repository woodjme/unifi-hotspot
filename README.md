# unifi-hotspot

[![Dependency Status](https://david-dm.org/woodjme/unifi-hotspot.svg)](https://david-dm.org/woodjme/unifi-hotspot)
[![Build Status](https://travis-ci.org/woodjme/unifi-hotspot.svg?branch=master)](https://travis-ci.org/woodjme/unifi-hotspot)
[![Code Climate](https://codeclimate.com/github/woodjme/unifi-hotspot/badges/gpa.svg)](https://codeclimate.com/github/woodjme/unifi-hotspot)

The purpose of this repo is to provide a basic, barebones Node.js based external portal server for authorising Wi-Fi guests on Unifi products.
Currently tested with Unifi controller version 5.6.30

## Getting Started

### Docker

To get started with docker you can use the command below as reference. The application runs on port `4545` so which ever port you choose needs to be redirected to `4545`. You also need to provide a `username`, `password`, `uri` including protocol and port, and `sitename` of the Unifi server.

```bash
docker run -d \
-p 80:4545 \
-e username=ubnt \
-e password=password \
-e uri=https://192.168.75.134:8443 \
-e sitename=default \
woodjme/unifi-hotspot
```

Once started navigate to `http://localhost:80/guest/s/default/` to test splash page.

You then need to configure the unifi portal to look at this container. To do this go to the `Unifi Control panel` -> `Guest Control` -> `Enable Guest Control` -> `External Portal Server` -> Add the `ip address` of your container host as well as the `port` used that forwards to `4545`.
