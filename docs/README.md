# Documentation

> **Exciting News!**
>
> Coming soon! I will be offering a hosted version of this application. If you're interested in early access, sign up [here](https://guestgate.cloud).

## What's New in V3

### Features and Improvements

- Added support for devices with built-in controllers such as the Unifi Dream Machine.
- Upgraded to NodeJS Version 20.
- Codebase rewritten in Typescript.

### Breaking Changes

- The `URI` environment variable has been renamed to `UNIFI_CONTROLLER_URL`.
- The `SITENAME` environment variable has been renamed to `UNIFI_SITE_IDENTIFIER`.
- The `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL` and `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` environment variables have been replaced with `LOG_AUTH_GOOGLE_CREDENTIALS`.

## Quick Start Guide

### Configure Unifi Controller

_todo video_
This step varies quite a bit from controller version to controller version but the idea is:

- Configure a new WLAN and enable Hotspot Portal (sometimes called Guest Control)
- Go to the landing portal settings page (Insights -> Hotspot -> Landing Page)
  - Choose External Portal Server and set the Exteral Portal Server to the IP of this service
  - Enable Show Landing Page
  - Enable HTTPs Redirect Support
  - Optionally Enable Domain and Secure Portal

### Setup Captive Portal

#### Clone the repo

```sh
git clone https://github.com/woodjme/unifi-hotspot.git
cd unifi-hotspot
```

#### Install Dependencies

`npm install --omit=dev --ignore-scripts`

#### Configure Environment

A full list of environment variables can be found [here](#environment-variables).

`cp .env.example .env`

#### Start Service

`npm start`

### Docker

To get started using Docker, you can use the command below as a reference. The application runs by default on port `4545`, so whichever port you choose needs to be redirected to `4545`. I strongly recommend using `80`.

A full list of environment variables can be found [here](#environment-variables).

```bash
docker run -d \
-p 80:4545 \
-e UNIFI_USER=ubnt \
-e UNIFI_PASS=password \
-e UNIFI_CONTROLLER_TYPE=standalone \
-e UNIFI_CONTROLLER_URL=https://unifi.guestgate.cloud \
-e UNIFI_SITE_IDENTIFIER=default \
-e SECRET=secretString \
-e AUTH=none \
-e REDIRECTURL=https://guestgate.cloud \
-e PORT=4545 \
woodjme/unifi-hotspot
```

Once started, navigate to the path `guest/s/$SITENAME/` to test the splash page.

## Authentication

### None

Automatically authorizes users to the Wi-Fi without using authentication. It will display a "Connect to Wi-Fi" button which will be automatically clicked if JavaScript is available.

### UserInfo

Displays a basic user information authentication page requiring the user's name and email address to continue.

### Custom

Allows you to use your own authentication page by mounting `custom.html` inside the container. Remember that users cannot load external assets until they are authorized, so you must bundle these in the `custom.html` page. [ParcelJS](https://parceljs.org) can help with this.

[See Bind Mounts](#bind-mounts)

At a minimum, the page you provide must send a `POST` request to `/authorize`. You can look at either [noAuth.html](https://github.com/woodjme/unifi-hotspot/blob/master/public/noAuth.html) or [basic.html](https://github.com/woodjme/unifi-hotspot/blob/master/public/basic.html) as a reference.

## Capture User Data & Logging Authorizations

Data can be captured from users, such as email addresses from the form shown once a user connects to the hotspot. The `basicInfo.html` page contains an example of capturing a user's name and email address.

There are currently two different drivers available to store captured user data:

- Webhooks
- Google Sheets

### Webhooks

Webhooks allow you to forward the input form body from the hotspot portal to your web service. The form will be copied exactly as is.

To configure webhooks, the following environment variables must be set:

- `LOG_AUTH_DRIVER=webhook`
- `LOG_AUTH_WEBHOOK_URL=https://yourWebService`

The webhook driver will send a `POST` request to the provided web service every time a user connects to the Wi-Fi hotspot.

### Google Sheets

To configure Google Sheets, the following environment variables must be set:

- `LOG_AUTH_DRIVER=googlesheets`
- `LOG_AUTH_GOOGLE_SHEET_ID` - from the sheets URL after `/d/` and before `/edit`
- `LOG_AUTH_GOOGLE_CREDENTIALS` - a base64 encoding of your downloaded Google JSON file

#### Google Sheets Authentication

##### Set up Your Google Project & Enable the Sheets API

1. Go to the [Google Developers Console](https://console.developers.google.com/)
2. Select your project or create a new one (and then select it)
3. Enable the Sheets API for your project
   - In the sidebar on the left, select **APIs & Services > Library**
   - Search for "sheets"
   - Click on "Google Sheets API"
   - Click the blue "Enable" button

##### Create a Service Account

1. Follow the steps above to set up the project and enable the Sheets API.
2. Create a service account for your project.
   - In the sidebar on the left, select **APIs & Services > Credentials**
   - Click the blue "+ CREATE CREDENTIALS" and select the "Service account" option
   - Enter name and description, then click "CREATE"
   - You can skip permissions, then click "CONTINUE"
   - Click the "+ CREATE KEY" button
   - Select the "JSON" key type option
   - Click the "Create" button
   - Your JSON key file is generated and downloaded to your machine (**it is the only copy!**)
   - Click "DONE"
   - Note your service account's email address (also available in the JSON key file)

#### Google Sheet Setup

1. Create a new Google Sheet and invite the Service Account with read/write permissions using the service account's email address.
2. Add headings for the data you want to see in the sheet, such as `name`, `email`, etc. These headings must match the `name` attribute of the inputs in the HTML form that users submit when they connect to the hotspot.
3. Note the Google Sheets ID - from the sheets URL after `/d/` and before `/edit`.

## Bind Mounts

### Custom Auth Page

```bash
-v /pathToAuthPageDirectory:/usr/src/app/public
```

## Environment Variables

You must provide `UNIFI_USER`, `UNIFI_PASS`, and `UNIFI_CONTROLLER_URL` for the application to start.

| Name                    |                Example                 |                                  Description |
| :---------------------- | :------------------------------------: | -------------------------------------------: |
| `UNIFI_USER`            |                 `ubnt`                 |               Your Unifi controller username |
| `UNIFI_PASS`            |               `password`               |               Your Unifi controller password |
| `UNIFI_CONTROLLER_URL`  |    `https://unifi.guestgate.cloud`     |                    Your Unifi controller URL |
| `UNIFI_CONTROLLER_TYPE` |       `standalone OR integrated`       |                    Your Unifi controller URL |
| `UNIFI_SITE_IDENTIFIER` |               `default`                | The site identifier in your Unifi controller |
| `SESSION_SECRET`        |            `myrandomstring`            |        A secret for the express user session |
| `AUTH`                  | `none OR userInfo OR simple OR custom` |            The auth page you want to display |
| `REDIRECTURL`           |            `/success.html`             |           The page to redirect to after auth |
| `LOG_AUTH_DRIVER`       |             `googlesheets`             |       The driver to use to capture user data |
| `LOG_AUTH_$DRIVER_$OPT` |                 `n/a`                  |         Options set for each log_auth driver |
| `PORT`                  |                  `80`                  |           The port to run the application on |

### UNIFI_USER

A note for users using a UDM device. There is a predefined role called `hotspot_operator` which you would assume gives you enough permissions to authorise a Guest. At the moment, it seems it doesn't using this
will result in permissions error.

### UNIFI_CONTROLLER_TYPE

- `standalone` for self hosted unifi controllers
- `integrated` for devices such as a Unifi Dream Machine

### UNIFI_SITE_IDENTIFIER

For integrated controller this will always be `default` for `standlone` check the ID in the URL of your Unifi Controller when selecting a site
