declare module 'logger' {
  const logger: {
    error: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
  };

  export default logger;
}

declare module 'config' {
  export const requiredEnvVars: readonly ['REDIRECTURL', 'UNIFI_DEVICE_TYPE', 'LOG_AUTH_DRIVER'];

  export interface Config {
    redirectUrl: string;
    unifiSiteName: string;
    deviceType: string;
    logAuthDriver?: string;
    uri?: string;
    secret: string;
    port?: number;
  }

  export const config: Config;

  export function validateConfig(): void;

}

import 'express-session';
declare module 'express-session' {
  interface SessionData {
    macAddr?: string;
    accessPoint?: string;
    time?: string;
    url?: string;
    ssid?: string;
  }
}
