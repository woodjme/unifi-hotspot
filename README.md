# unifi-hotspot

[![Dependency Status](https://david-dm.org/woodjme/unifi-hotspot.svg)](https://david-dm.org/woodjme/unifi-hotspot)
[![Code Climate](https://codeclimate.com/github/woodjme/unifi-hotspot/badges/gpa.svg)](https://codeclimate.com/github/woodjme/unifi-hotspot)

The purpose of this repo is to provide a basic, barebones Node.js based external portal server for authorising Wi-Fi guests on Unifi products.
Currently tested with Unifi controller version 5.9.29

## Full Documentation

[Docs](docs.unifi-hotspot.jamiewood.io)

## Getting Started

### Docker

To get started with docker you can use the command below as a reference. The application runs on port `4545` so whichever port you choose needs to be redirected to `4545`. You also need to provide a `username`, `password`, `uri` including protocol and port, and `sitename` of the Unifi server.

```bash
docker run -d \
-p 80:4545 \
-e USERNAME=ubnt \
-e PASSWORD=password \
-e URI=https://unifi.jamiewood.io \
-e SITENAME=default \
-e SECRET=secretString \
woodjme/unifi-hotspot
```

Once started navigate to `http://localhost:80/guest/s/$sitename/` to test splash page.

You then need to configure the unifi portal to look at this container. To do this go to the `Unifi Control panel` -> `Guest Control` -> `Enable Guest Control` -> `External Portal Server` -> Add the `ip address` or `DNS name` of your container host.
