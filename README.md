# unifi-hotspot

The purpose of this repo is to provide a flexible, Node.js based external portal server for authorising Wi-Fi guests on Unifi products. Out of the box is currently support storing user information in Google Sheets or posting it via a webhook.

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

## Documentation

[Documentation](https://docs.unifi-hotspot.jamiewood.io)
