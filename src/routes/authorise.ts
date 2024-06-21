import express, { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { webhook, googleSheets } from '../utils/logAuthDrivers';
import { config, DeviceType } from '../utils/config';

import { UnifiApiService } from '../interfaces/UnifiApiService';
import { legacyUnifiModule, modernUnifiModule } from '../unifi/index';

const authoriseRouter = express.Router();

const unifiAuthServices: Record<DeviceType, UnifiApiService> = {
  legacy: legacyUnifiModule,
  unifios: modernUnifiModule,
};

const selectedModules = unifiAuthServices[config.deviceType];

authoriseRouter.route('/').post(async (req: Request, res: Response) => {
  try {
    logger.info('Starting Unifi Login Attempt');
    await selectedModules.login();

    if (config.logAuthDriver) {
      await logAuth(req.body);
    }

    logger.info('Starting Unifi Device Authorisation Attempt');
    await selectedModules.authorise(req);

    res.redirect(config.redirectUrl);

    logger.info('Starting Unifi Logout Attempt');
    await selectedModules.logout();
  } catch (err) {
    res
      .status(500)
      .json({ err: { message: 'An Error has occurred. Please try again.' } });
    logger.error(err);
  }
});

export default authoriseRouter;

// Handle LogAuth
const logAuth = async (formData: any): Promise<void> => {
  switch (config.logAuthDriver) {
    case 'webhook':
      await webhook(formData);
      break;
    case 'googlesheets':
      await googleSheets(formData);
      break;
    default:
      break;
  }
};
