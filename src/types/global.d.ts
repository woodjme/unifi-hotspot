declare module 'logger' {
  const logger: {
    error: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
  };

  export default logger;
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
