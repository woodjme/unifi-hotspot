# Documentation

## What's new in V2

### BREAKING CHANGES

* The `USERNAME` environment variable has been renamed to `UNIFI_USER`
* The `PASSWORD` environment variable has been renamed to `UNIFI_PASS`
* Changed `basic` value for `AUTH_ENV` to `userInfo`

### Features and Improvements

* Bumped to NodeJS Version 18
* Removed `request` and `request-promise` packages in favour of `axios`
* Rewritten authorisation controller
* 🎉 Store the contents of the hotspot form using `LOG_AUTH` drivers 🎉
* Listen on port given in env

## Quick Start Guide

### Docker

To get started using docker you can use the command below as a reference. The application runs on port `4545` so whichever port you choose needs to be redirected to `4545`. You also need to provide a `username`, `password`, `uri` including protocol and port, and `sitename` for the Unifi server.

A full list of enviroment variables can be found [here](#environment-variables)

```bash
docker run -d \
-p 80:4545 \
-e UNIFI_USER=ubnt \
-e UNIFI_PASS=password \
-e UNIFI_URI=https://unifi.jamiewood.io \
-e SITENAME=default \
-e SECRET=secretString \
-e AUTH=none \
-e REDIRECTURL=https://google.com \
-e PORT=4545 \
woodjme/unifi-hotspot
```

Once started navigate to the path`guest/s/$SITENAME/` to test splash page.

You then need to configure the unifi portal to look at this container. To do this go to the `Unifi Control panel` -> `Guest Control` -> `Enable Guest Control` -> `External Portal Server` -> Add the `IP Address` or `DNS Name` of your server / container host.

## Authentication

### None

Automatically authorises users to the Wi-Fi without using authentication. Will display a "Connect to Wi-Fi" button which will be automatically clicked if JavaScript is available.

### UserInfo

Display a basic user information authentication page requiring the users name and email address to continue.

### Custom

Allows you to bring your own authentication page by mounting `custom.html` inside the container. Rememeber that users cannot load external assets until you are authorised so you must bundle these in the `custom.html` page. [ParcelJS](https://parceljs.org) can help with this.

[See Bind Mounts](#bind-mounts)

At a minimum the page you provide must send a `POST` request to `/authorise`. You can look at either [noAuth.html](https://github.com/woodjme/unifi-hotspot/blob/master/public/noAuth.html) or [basic.html](https://github.com/woodjme/unifi-hotspot/blob/master/public/basic.html) as a reference.

## Capture User Data & Logging Authorisations

Data can be captured from users, such as email addresses from the form that is shown once a user connects to the hotspot. The `basicInfo.html` page contains an example of capturing a users name and email address.

There are currently two different drivers available to store captured user data.

* Webhooks
* Google Sheets

### Webhooks

Webhooks allow you to forward on the body of the input form from the hotspot portal onto your own webservice to do what you see fit with. The form will be copied exactly as is.

To configure webhook the follow environment variables must be set

* `LOG_AUTH_DRIVER=webhook`
* `LOG_AUTH_WEBHOOK_URL=https://yourWebService`

The webhook driver will send a `POST` request to the provided webservice everytime a user connects to the Wi-Fi hotspot.

### Google Sheets

To configure Google Sheets the following environment variables must be set

* `LOG_AUTH_DRIVER=googlesheets`
* `LOG_AUTH_GOOGLE_SHEET_ID` - from the sheets URL after `/d/` and before `/edit`
* `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL` - [See Google Sheets Authentication](#google-sheets-authentication)
* `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` -[See Google Sheets Authentication](#google-sheets-authentication)

#### Google Sheets Authentication

##### Set up your google project & enable the sheets API

1. Go to the [Google Developers Console](https://console.developers.google.com/)
2. Select your project or create a new one (and then select it)
3. Enable the Sheets API for your project

* In the sidebar on the left, select **APIs & Services > Library**
* Search for "sheets"
* Click on "Google Sheets API"
* click the blue "Enable" button

##### Create Service Account

1. Follow steps above to set up project and enable sheets API
2. Create a service account for your project

* In the sidebar on the left, select **APIs & Services > Credentials**
* Click blue "+ CREATE CREDENTIALS" and select "Service account" option
* Enter name, description, click "CREATE"
* You can skip permissions, click "CONTINUE"
* Click "+ CREATE KEY" button
* Select the "JSON" key type option
* Click "Create" button
* your JSON key file is generated and downloaded to your machine (**it is the only copy!**)
* click "DONE"
* note your service account's email address (also available in the JSON key file)

#### Google Sheet Setup

1. Create a new Google Sheet and invite the Service Account with read/write permissions using the service account's email address
2. Add headings for the data you want to see in the sheet such as `name`, `email` etc. These headings must match the `name` attribute of the inputs in the html form that the users are submitting when they conncect to the hotspot.
3. note the Google Sheets ID - from the sheets URL after `/d/` and before `/edit`

## Bind Mounts

### Custom Auth Page

`-v /pathToAuthPageDirectory:/usr/src/app/public`

## Environment Variables

| Name       | Example     | Description     |
| :------------- | :----------: | -----------: |
|  `UNIFI_USER` | `ubnt`   | your unifi controller username    |
|  `UNIFI_PASS` | `password`   | your unifi controller password    |
|  `UNIFI_URI` | `https://unifi.jamiewood.io`   | your unifi controller uri    |
|  `SITENAME` | `default`   | the sitename in your unifi controller    |
|  `SECRET` | `myrandomstring`   | a secret for the express user session    |
|  `AUTH` | `none OR userInfo OR simple OR custom`   | the auth page you want to display    |
|  `REDIRECTURL` | `https://google.com`   | the page to redirect to after auth    |
|  `PORT` | `4545`   | the port to run the application on    |
|  `LOG_AUTH_DRIVER` | `googlesheets`   | the driver to use to capture user data   |
|  `LOG_AUTH_$DRIVER_$OPT` | `n/a`   | options set for each log_auth drivers   |
