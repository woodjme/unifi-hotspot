# unifi-hotspot

[![Dependency Status](https://david-dm.org/woodjamie/unifi-hotspot.svg)](https://david-dm.org/woodjamie/unifi-hotspot)
[![Build Status](https://travis-ci.org/woodjamie/unifi-hotspot.svg?branch=master)](https://travis-ci.org/woodjamie/unifi-hotspot)
[![Code Climate](https://codeclimate.com/github/woodjamie/unifi-hotspot/badges/gpa.svg)](https://codeclimate.com/github/woodjamie/unifi-hotspot)

The purpose of this repo is to provide a basic, barebones Node.js based external portal server for authorising Wi-Fi guests on Unifi products.
Currently tested with Unifi controller version 5.0.7

## Getting Started

### Docker

```bash
docker run -d \
-p 80:4545 \
-e username=ubnt \
-e password=password \
-e uri=https://192.168.0.1:8443 \
-e sitename=default \
woodjme/unifi-hotspot
```

### Once started navigate to `http://localhost/guest/s/default/`
