import pino from 'pino';
let logger: pino.BaseLogger;

if (process.env.NODE_ENV === 'development') {
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
    },
  });
} else {
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
  });
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expressPino = require('pino-http')({
  logger: logger,
  useLevel: 'trace',
});

export { logger, expressPino };
