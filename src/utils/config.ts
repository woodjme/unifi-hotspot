/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { logger } from './logger';

const requiredEnvVars = [
  'UNIFI_USER',
  'UNIFI_PASS',
  'UNIFI_CONTROLLER_URL',
] as const;

export enum LogAuthDriver {
  None = 'none',
  Webhook = 'webhook',
  Googlesheets = 'googlesheets',
}

export enum UnifiControllerType {
  Standalone = 'standalone',
  Integrated = 'integrated',
}

type Config = {
  unifiUsername: string;
  unifiPassword: string;
  unifiControllerUrl?: string;
  unifiControllerType: UnifiControllerType;
  unifiSiteIdentifier: string;
  sessionSecret: string;
  auth?: string;
  redirectUrl: string;
  logAuthDriver: LogAuthDriver;
  port?: string;
};

const config: Config = {
  unifiUsername: process.env.UNIFI_USER!,
  unifiPassword: process.env.UNIFI_PASS!,
  unifiControllerUrl: process.env.UNIFI_CONTROLLER_URL || process.env.URI,
  unifiControllerType:
    (process.env.UNIFI_CONTROLLER_TYPE as UnifiControllerType) ||
    UnifiControllerType.Standalone,
  unifiSiteIdentifier:
    process.env.UNIFI_SITE_IDENTIFIER || process.env.SITENAME || 'default',
  sessionSecret: process.env.SESSION_SECRET || 'secret',
  auth: process.env.AUTH || 'none',
  redirectUrl: process.env.REDIRECTURL || 'https://guestgate.cloud/',
  logAuthDriver:
    (process.env.LOG_AUTH_DRIVER as LogAuthDriver) || LogAuthDriver.None,
  port: process.env.PORT || '4545',
};

function checkForRequiredEnvVars(): void {
  // Check for required env vars
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      logger.error(`Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  });
  logger.debug('All required environment variables are present');
}

function validateConfig(): void {
  // Validate UnifiControllerType
  if (
    !Object.values(UnifiControllerType).includes(config.unifiControllerType)
  ) {
    logger.error(
      `Invalid value for UNIFI_CONTROLLER_TYPE. Expected one of: ${Object.values(UnifiControllerType).join(', ')}`,
    );
    process.exit(1);
  }

  // Validate LogAuthDriver
  if (!Object.values(LogAuthDriver).includes(config.logAuthDriver)) {
    logger.error(
      `Invalid value for LOG_AUTH_DRIVERS. Expected one of: ${Object.values(LogAuthDriver).join(', ')}`,
    );
    process.exit(1);
  }

  logger.debug('Configuration is valid');
}

export { config, validateConfig, checkForRequiredEnvVars };
