# unifi-hotspot

> Simplify your experience with our newly launched hosted version of this application. Perfect for those who prefer a hassle-free setup or are willing to pay a premium for a managed solution. Don’t miss out—get started today here![here](https://www.guestgate.cloud)!

A versatile external captive portal server designed for authorizing Wi-Fi guests on Unifi products. It supports flexible user data storage solutions, including integration with Google Sheets and webhooks.

## Documentation

For detailed information on how to set up and use this application, please refer to the [Documentation](https://docs.unifi-hotspot.jamiewood.io).

## Quick Start (Ubuntu 24.04)

```bash
git clone https://github.com/AyvaLtd/unifi-hotspot.git
cd unifi-hotspot
./bootstrap.sh
```

See [DEPLOY.md](DEPLOY.md) for complete deployment instructions.

## What's New in V3.3

### New Features

- **Multi-Controller Support**: Authorize guests on multiple UniFi controllers simultaneously
  - Configure multiple controllers with individual credentials
  - Parallel authorization for improved performance
  - Enable/disable controllers individually

- **Dynamic Controller IP Detection**: Automatically detect controller IP from request headers
  - Perfect for mobile hotspots and multi-site deployments
  - No hardcoded controller URLs required
  - Fallback to configured URLs when detection fails

- **Ubuntu 24.04 Bootstrap Script**: One-command setup for new deployments
  - Automated Node.js installation
  - Dependency management
  - Build verification

### Configuration Examples

**Single Controller (Legacy - Still Supported)**:
```bash
UNIFI_USER=admin
UNIFI_PASS=password
UNIFI_CONTROLLER_URL=https://controller.example.com
```

**Multiple Controllers**:
```bash
UNIFI_CONTROLLERS=[{"url":"https://controller1.example.com","username":"admin1","password":"pass1","type":"standalone","siteIdentifier":"default","enabled":true},{"url":"https://controller2.example.com","username":"admin2","password":"pass2","type":"integrated","siteIdentifier":"site2","enabled":true}]
```

**Dynamic IP Detection**:
```bash
UNIFI_CONTROLLERS=[{"url":"auto","username":"admin","password":"pass","type":"standalone","siteIdentifier":"default","enabled":true}]
```

See [DEPLOY.md](DEPLOY.md) for detailed configuration options.

## What's New in V3

### Features and Improvements

- Added support for devices with built-in controllers such as the Unifi Dream Machine.
- Upgraded to NodeJS Version 20.
- Codebase rewritten in Typescript.

### Breaking Changes

- The `URI` environment variable has been renamed to `UNIFI_CONTROLLER_URL`.
- The `SITENAME` environment variable has been renamed to `UNIFI_SITE_IDENTIFIER`.
- The `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL` and `LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` environment variables have been replaced with `LOG_AUTH_GOOGLE_CREDENTIALS`.

