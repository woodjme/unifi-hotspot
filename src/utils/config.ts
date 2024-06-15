import { logger } from './logger';

const requiredEnvVars = ['REDIRECTURL', 'UNIFI_DEVICE_TYPE', 'LOG_AUTH_DRIVER'] as const;

export type DeviceType = 'legacy' | 'unifios';

type Config = {
  redirectUrl: string;
  unifiSiteName: string;
  unifiUsername?: string;
  unifiPassword?: string;
  deviceType: DeviceType;
  logAuthDriver?: string;
  uri?: string;
  secret: string;
  port?: string;
  auth?: string;
};

const config: Config = {
  redirectUrl: process.env.REDIRECTURL || 'https://www.google.com',
  unifiSiteName: process.env.UNIFI_SITENAME || process.env.SITENAME || 'default',
  unifiUsername: process.env.UNIFI_USER,
  unifiPassword: process.env.UNIFI_PASS,
  deviceType: (process.env.UNIFI_DEVICE_TYPE as DeviceType) || 'legacy',
  logAuthDriver: process.env.LOG_AUTH_DRIVER,
  uri: process.env.UNIFI_URL || process.env.URI,
  secret: process.env.SECRET || 'secret',
  port: process.env.PORT || "4545",
  auth: process.env.AUTH || 'none',
};

function validateConfig(): void {
  // Check for URI or UNIFI_URL
  if (!config.uri) {
    logger.error('Missing required environment variable: UNIFI_URL (or deprecated URI)');
    process.exit(1);
  }
  if (process.env.URI) {
    logger.warn('Warning: The URI environment variable is deprecated and will be removed in the future. Please use UNIFI_URL instead.');
  }

  // Check for SITENAME or UNIFI_SITENAME
  if (!config.unifiSiteName) {
    logger.error('Missing required environment variable: UNIFI_SITENAME');
    process.exit(1);
  }
  if (process.env.SITENAME) {
    logger.warn('Warning: The SITENAME environment variable is deprecated and will be removed in the future. Please use UNIFI_SITENAME instead.');
  }

  // Check for required env vars
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      logger.error(`Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  });
}

export { config, validateConfig };
