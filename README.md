# unifi-hotspot

> Simplify your experience with our newly launched hosted version of this application. Perfect for those who prefer a hassle-free setup or are willing to pay a premium for a managed solution. Don’t miss out—get started today here![here](https://www.guestgate.cloud)!

A versatile external captive portal server designed for authorizing Wi-Fi guests on Unifi products. It supports flexible user data storage solutions, including integration with Google Sheets and webhooks.

## Documentation

For detailed information on how to set up and use this application, please refer to the [Documentation](https://docs.unifi-hotspot.jamiewood.io).

## What's New in V3

### Features and Improvements

- Added support for devices with built-in controllers such as the Unifi Dream Machine.
- Upgraded to NodeJS Version 20.
- Codebase rewritten in Typescript.

### Breaking Changes

- The `URI` environment variable has been renamed to `UNIFI_CONTROLLER_URL`.
- The `SITENAME` environment variable has been renamed to `UNIFI_SITE_IDENTIFIER`.
- The `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL` and `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` environment variables have been replaced with `LOG_AUTH_GOOGLE_CREDENTIALS`.

