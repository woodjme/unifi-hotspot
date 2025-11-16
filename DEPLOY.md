# Deployment Guide - UniFi Hotspot

This guide explains how to deploy the UniFi Hotspot application on Ubuntu 24.04 LTS.

## Table of Contents

- [Quick Start](#quick-start)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Single Controller Setup](#single-controller-setup)
  - [Multi-Controller Setup](#multi-controller-setup)
  - [Dynamic IP Detection](#dynamic-ip-detection)
- [Running the Application](#running-the-application)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start

For Ubuntu 24.04, use the provided bootstrap script:

```bash
git clone https://github.com/AyvaLtd/unifi-hotspot.git
cd unifi-hotspot
./bootstrap.sh
```

The script will:
- Check for Node.js 20+ (install if missing)
- Install dependencies
- Create `.env` from `.env.example`
- Build the TypeScript project

## System Requirements

- **Operating System**: Ubuntu 24.04 LTS (or compatible Linux)
- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Memory**: Minimum 512MB RAM
- **Disk Space**: ~200MB for application and dependencies

## Installation

### Automated Installation (Recommended)

Run the bootstrap script:

```bash
./bootstrap.sh
```

### Manual Installation

If you prefer to install manually:

1. **Install Node.js 20.x**

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node -v  # Should be v20.x.x or higher
npm -v
```

2. **Clone and Build**

```bash
git clone https://github.com/AyvaLtd/unifi-hotspot.git
cd unifi-hotspot
npm install
npm run build
```

3. **Configure Environment**

```bash
cp .env.example .env
nano .env  # Edit with your settings
```

## Configuration

### Single Controller Setup

For a single UniFi controller, edit `.env`:

```bash
# Required
UNIFI_USER=your_admin_username
UNIFI_PASS=your_admin_password
UNIFI_CONTROLLER_URL=https://your-controller.example.com

# Optional
UNIFI_CONTROLLER_TYPE=standalone  # or 'integrated' for UDM
UNIFI_SITE_IDENTIFIER=default
SESSION_SECRET=your-secret-key
AUTH=none  # or 'simple', 'userInfo', 'custom'
PORT=80
```

### Multi-Controller Setup

To authorize guests on multiple UniFi controllers simultaneously, use the `UNIFI_CONTROLLERS` variable:

```bash
UNIFI_CONTROLLERS=[{"url":"https://controller1.example.com","username":"admin1","password":"pass1","type":"standalone","siteIdentifier":"default","enabled":true},{"url":"https://controller2.example.com","username":"admin2","password":"pass2","type":"integrated","siteIdentifier":"site2","enabled":true}]
```

**Controller Configuration Fields:**

- `url` (optional): Controller URL or `"auto"` for dynamic detection
- `username` (required): Controller admin username
- `password` (required): Controller admin password
- `type` (optional): `"standalone"` or `"integrated"` (default: `"standalone"`)
- `siteIdentifier` (optional): Site name in controller (default: `"default"`)
- `enabled` (optional): `true`/`false` to enable/disable (default: `true`)

**Example - Multiple Controllers:**

```json
[
  {
    "url": "https://unifi1.example.com",
    "username": "admin",
    "password": "password1",
    "type": "standalone",
    "siteIdentifier": "default",
    "enabled": true
  },
  {
    "url": "https://unifi2.example.com:8443",
    "username": "admin",
    "password": "password2",
    "type": "integrated",
    "siteIdentifier": "site2",
    "enabled": true
  }
]
```

**Important Notes:**

- When `UNIFI_CONTROLLERS` is set, it takes precedence over legacy single-controller variables
- Authorization succeeds if at least one controller authorizes the guest
- All enabled controllers are processed in parallel for performance
- Failed controllers are logged but don't prevent overall success

### Dynamic IP Detection

For scenarios where the controller IP is not known in advance (e.g., mobile hotspots, multi-site deployments), use dynamic detection:

```json
[
  {
    "url": "auto",
    "username": "admin",
    "password": "password",
    "type": "standalone",
    "siteIdentifier": "default",
    "enabled": true
  }
]
```

Or omit the `url` field entirely:

```json
[
  {
    "username": "admin",
    "password": "password",
    "type": "standalone",
    "siteIdentifier": "default",
    "enabled": true
  }
]
```

**Detection Methods** (in order):

1. `X-Forwarded-For` header (when behind proxy/load balancer)
2. `Referer` header (from portal redirect)
3. Gateway query parameter (`?gw=` or `?gateway=`)

**Example Use Cases:**

- **Mobile Pop-up Hotspots**: Controller IP changes based on deployment location
- **Multi-site Networks**: Single portal instance serving multiple locations
- **Cloud Controllers**: Dynamic IP addresses or multiple endpoints

## Running the Application

### Development Mode

```bash
npm start
```

This will build and start the application on the configured port (default: 4545).

### Production Mode

For production, use a process manager like PM2:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start dist/index.js --name unifi-hotspot

# Configure PM2 to start on boot
pm2 startup
pm2 save

# View logs
pm2 logs unifi-hotspot

# Monitor
pm2 monit
```

### Systemd Service (Alternative)

Create `/etc/systemd/system/unifi-hotspot.service`:

```ini
[Unit]
Description=UniFi Hotspot Portal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/unifi-hotspot
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable unifi-hotspot
sudo systemctl start unifi-hotspot
sudo systemctl status unifi-hotspot
```

## Production Deployment

### Security Checklist

- [ ] Use strong `SESSION_SECRET` (generate with: `openssl rand -base64 32`)
- [ ] Enable HTTPS/TLS (use reverse proxy like nginx)
- [ ] Store `.env` file securely (not in git)
- [ ] Use environment-specific credentials
- [ ] Regularly update dependencies (`npm audit fix`)
- [ ] Configure firewall (UFW):

```bash
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Reverse Proxy with Nginx

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name portal.example.com;

    location / {
        proxy_pass http://localhost:4545;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables

All configuration through `.env`:

```bash
# Copy production template
cp .env.example .env.production

# Edit production config
nano .env.production

# Use in production
NODE_ENV=production node dist/index.js
```

## Troubleshooting

### Build Failures

**Issue**: TypeScript compilation errors

```bash
# Clean and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Controller Connection Issues

**Issue**: Cannot connect to UniFi controller

1. Check controller URL is correct and accessible:
   ```bash
   curl -k https://your-controller-url
   ```

2. Verify credentials in `.env`

3. Check controller type (`standalone` vs `integrated`)

4. Enable debug logging:
   ```bash
   NODE_ENV=development npm start
   ```

### Multi-Controller Issues

**Issue**: Authorization fails on all controllers

- Check logs for individual controller errors
- Verify each controller's credentials separately
- Ensure at least one controller is `"enabled": true`
- Test single controller first, then add more

### Dynamic IP Detection Not Working

**Issue**: Auto-detection fails to find controller

1. Check request headers contain expected information:
   - Verify `X-Forwarded-For` if behind proxy
   - Check `Referer` header from portal redirect

2. Use explicit URL as fallback:
   ```json
   {"url": "https://backup-controller.example.com", ...}
   ```

3. Add gateway parameter to portal URL:
   ```
   https://portal.example.com/guest/s/default/?gw=192.168.1.1
   ```

### Port Already in Use

**Issue**: `EADDRINUSE` error

```bash
# Find process using port 80
sudo lsof -i :80

# Kill the process (replace PID)
sudo kill -9 <PID>

# Or use a different port in .env
PORT=8080
```

### Logs

View application logs:

```bash
# PM2
pm2 logs unifi-hotspot

# Systemd
sudo journalctl -u unifi-hotspot -f

# Direct output (development)
NODE_ENV=development npm start
```

## Additional Resources

- [UniFi API Documentation](https://ubntwiki.com/products/software/unifi-controller/api)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

## Support

For issues and feature requests, please use:
- GitHub Issues: https://github.com/AyvaLtd/unifi-hotspot/issues
