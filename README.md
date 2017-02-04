[![Dependency Status](https://david-dm.org/woodjamie/unifi-hotspot.svg)](https://david-dm.org/woodjamie/unifi-hotspot)
[![Build Status](https://travis-ci.org/woodjamie/unifi-hotspot.svg?branch=master)](https://travis-ci.org/woodjamie/unifi-hotspot)
[![Code Climate](https://codeclimate.com/github/woodjamie/unifi-hotspot/badges/gpa.svg)](https://codeclimate.com/github/woodjamie/unifi-hotspot)
[![NPM](https://nodei.co/npm/unifi-hotspot.png)](https://nodei.co/npm/unifi-hotspot/)
# unifi-hotspot
A Node.JS based external portal server for authorising Wi-Fi guests on Unifi products.
Currently written to work with Unifi controller version  5.0.7

## Getting Started
### Docker Support
* Clone repo:  
* `git clone https://github.com/woodjamie/unifi-hotspot.git`
* cd into repo:  
* `cd unifi-hotspot`
* Set port in Dockerfile
* `nano Dockerfile`
* Build docker image:   
* `docker build -t "unifi-hotspot" .`

#### Example starting docker container
```
docker run -d \
-p 4545:4545 \
-e port=4545 \
-e username=ubnt \
-e password=password \
-e uri=https://192.168.0.1:8443 \
-e sitename=default \
unifi-hotspot
```

### Once started navigate to `http://localhost:4545/guest/s/default/`