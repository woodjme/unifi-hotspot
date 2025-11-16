/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { logger } from './logger';

export enum LogAuthDriver {
  None = 'none',
  Webhook = 'webhook',
  Googlesheets = 'googlesheets',
}

export enum UnifiControllerType {
  Standalone = 'standalone',
  Integrated = 'integrated',
}

export enum Auth {
  None = 'none',
  Simple = 'simple',
  UserInfo = 'userInfo',
  Custom = 'custom',
}

export interface ControllerConfig {
  url?: string; // Optional - can be "auto" or empty for dynamic detection
  username: string;
  password: string;
  type: UnifiControllerType;
  siteIdentifier: string;
  enabled: boolean;
}

type Config = {
  // Legacy single-controller config (for backward compatibility)
  unifiUsername: string;
  unifiPassword: string;
  unifiControllerUrl?: string;
  unifiControllerType: UnifiControllerType;
  unifiSiteIdentifier: string;

  // New multi-controller config
  unifiControllers: ControllerConfig[];
  enableMultiController: boolean;

  // Other config
  sessionSecret: string;
  auth: Auth;
  redirectUrl: string;
  serverSideRedirect: string;
  showConnecting: string;
  logAuthDriver: LogAuthDriver;
  port?: string;
};

// Parse multi-controller configuration
function parseControllerConfig(): ControllerConfig[] {
  const controllersJson = process.env.UNIFI_CONTROLLERS;

  if (controllersJson) {
    try {
      const parsed = JSON.parse(controllersJson);
      if (Array.isArray(parsed)) {
        return parsed.map((ctrl: any) => ({
          url: ctrl.url || undefined,
          username: ctrl.username,
          password: ctrl.password,
          type:
            (ctrl.type as UnifiControllerType) ||
            UnifiControllerType.Standalone,
          siteIdentifier: ctrl.siteIdentifier || 'default',
          enabled: ctrl.enabled !== false, // Default to true
        }));
      }
    } catch (error) {
      logger.error('Failed to parse UNIFI_CONTROLLERS JSON:', error);
      process.exit(1);
    }
  }

  // Fallback to legacy single-controller config
  return [
    {
      url: process.env.UNIFI_CONTROLLER_URL || process.env.URI,
      username: process.env.UNIFI_USER!,
      password: process.env.UNIFI_PASS!,
      type:
        (process.env.UNIFI_CONTROLLER_TYPE as UnifiControllerType) ||
        UnifiControllerType.Standalone,
      siteIdentifier:
        process.env.UNIFI_SITE_IDENTIFIER || process.env.SITENAME || 'default',
      enabled: true,
    },
  ];
}

const controllers = parseControllerConfig();
const enableMultiController = !!process.env.UNIFI_CONTROLLERS;

const config: Config = {
  // Legacy config (first controller for backward compatibility)
  unifiUsername: controllers[0]?.username || process.env.UNIFI_USER!,
  unifiPassword: controllers[0]?.password || process.env.UNIFI_PASS!,
  unifiControllerUrl: controllers[0]?.url,
  unifiControllerType: controllers[0]?.type || UnifiControllerType.Standalone,
  unifiSiteIdentifier: controllers[0]?.siteIdentifier || 'default',

  // New multi-controller config
  unifiControllers: controllers,
  enableMultiController,

  // Other config
  sessionSecret: process.env.SESSION_SECRET || 'secret',
  auth: (process.env.AUTH as Auth) || Auth.Simple,
  redirectUrl: process.env.REDIRECTURL || '/success.html',
  serverSideRedirect: process.env.SERVER_SIDE_REDIRECT || 'true',
  showConnecting: process.env.SHOW_CONNECTING || 'true',
  logAuthDriver:
    (process.env.LOG_AUTH_DRIVER as LogAuthDriver) || LogAuthDriver.None,
  port: process.env.PORT || '4545',
};

function checkForRequiredEnvVars(): void {
  // If using multi-controller config, validate differently
  if (process.env.UNIFI_CONTROLLERS) {
    if (!config.unifiControllers || config.unifiControllers.length === 0) {
      logger.error('UNIFI_CONTROLLERS is set but no valid controllers found');
      process.exit(1);
    }
    // Validate each controller has required fields
    config.unifiControllers.forEach((ctrl, index) => {
      if (!ctrl.username || !ctrl.password) {
        logger.error(`Controller ${index}: missing username or password`);
        process.exit(1);
      }
    });
  } else {
    // Legacy validation - require single controller env vars
    const requiredEnvVars = ['UNIFI_USER', 'UNIFI_PASS'];
    requiredEnvVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        logger.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
      }
    });
  }
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

  // Validate Auth
  if (!Object.values(Auth).includes(config.auth)) {
    logger.error(
      `Invalid value for AUTH. Expected one of: ${Object.values(Auth).join(', ')}`,
    );
    process.exit(1);
  }

  logger.debug('Configuration is valid');

  // If integrated ignore site identifier
}

function maskSensitiveConfig(config: Config): Partial<Config> {
  return {
    ...config,
    unifiPassword: '****',
    unifiControllers: config.unifiControllers.map((ctrl) => ({
      ...ctrl,
      password: '****',
    })),
  };
}

export { config, validateConfig, checkForRequiredEnvVars, maskSensitiveConfig };
