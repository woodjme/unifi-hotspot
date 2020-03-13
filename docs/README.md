# Documentation

## Quick Start Guide

### Docker

To get started using docker you can use the command below as a reference. The application runs on port `4545` so whichever port you choose needs to be redirected to `4545`. You also need to provide a `username`, `password`, `uri` including protocol and port, and `sitename` for the Unifi server.

A full list of enviroment variables can be found [here](#environment-variables)

```bash
docker run -d \
-p 80:4545 \
-e USERNAME=ubnt \
-e PASSWORD=password \
-e URI=https://unifi.jamiewood.io \
-e SITENAME=default \
-e SECRET=secretString \
-e AUTH=none \
woodjme/unifi-hotspot
```

Once started navigate to the path`guest/s/$SITENAME/` to test splash page.

You then need to configure the unifi portal to look at this container. To do this go to the `Unifi Control panel` -> `Guest Control` -> `Enable Guest Control` -> `External Portal Server` -> Add the `IP Address` or `DNS Name` of your server / container host.

## Authentication

### None

Automatically authorises users to the Wi-Fi without using authentication. Will display a "Connect to Wi-Fi" button which will be automatically clicked if JavaScript is available.

### Basic

Display a basic authentication page requiring the users name and email address to continue.

### Custom

Allows you to bring your own authentication page by mounting `custom.html` inside the container. Rememeber that users cannot load external assets until you are authorised so you must bundle these in the `custom.html` page. [ParcelJS](https://parceljs.org) can help with this.

[See Bind Mounts](#bind-mounts)

At a minimum the page you provide must send a `POST` request to `/authorise`. You can look at either [noAuth.html](https://github.com/woodjme/unifi-hotspot/blob/master/public/noAuth.html) or [basic.html](https://github.com/woodjme/unifi-hotspot/blob/master/public/basic.html) as a reference.

## Bind Mounts

### Custom Auth Page

`-v /pathToAuthPageDirectory:/usr/src/app/public`

## Environment Variables

| Name       | Example     | Description     |
| :------------- | :----------: | -----------: |
|  `USERNAME` | `ubnt`   | your unifi controller username    |
|  `PASSWORD` | `password`   | your unifi controller password    |
|  `URI` | `https://unifi.jamiewood.io`   | your unifi controller uri    |
|  `SITENAME` | `default`   | the sitename in your unifi controller    |
|  `SECRET` | `myrandomstring`   | a secret for the express user session    |
|  `AUTH` | `none|basic|custom`   | the auth page you want to display    |
