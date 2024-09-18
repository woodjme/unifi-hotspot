// Import config from .env - Don't override existing env vars - this needs to happen first
import * as dotenv from 'dotenv';
dotenv.config({
  override: false,
});

// Setup config
import {
  config,
  validateConfig,
  checkForRequiredEnvVars,
  maskSensitiveConfig,
} from './utils/config';
import { logger, prettyLogger } from './utils/logger';

// Advertising hosted version
prettyLogger.info(`
  ===============================================
  🌐  \x1b[36mLooking for a hassle-free setup?\x1b[0m
  Check out our \x1b[32mhosted version\x1b[0m of this app for an easy, managed solution!
  
  \x1b[34mVisit: https://www.guestgate.cloud\x1b[0m
  ===============================================
  `);

checkForRequiredEnvVars();
validateConfig();
logger.info(maskSensitiveConfig(config));

import server from './server';
const port = config.port;

server.listen(port, function () {
  logger.info(`Server listening on port: ${port}`);
});
