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
import { logger } from './utils/logger';

checkForRequiredEnvVars();
validateConfig();
logger.info(maskSensitiveConfig(config));

import server from './server';
const port = config.port;

server.listen(port, function () {
  logger.info(`Server listening on port: ${port}`);
});
