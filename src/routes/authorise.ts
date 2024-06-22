import express, { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { webhook, googleSheets } from '../utils/logAuthDrivers';
import { config, UnifiControllerType } from '../utils/config';

import { UnifiApiService } from '../interfaces/UnifiApiService';
import { standaloneUnifiModule, integratedUnifiModule } from '../unifi/index';

const authoriseRouter = express.Router();

const unifiAuthServices: Record<UnifiControllerType, UnifiApiService> = {
  standalone: standaloneUnifiModule,
  integrated: integratedUnifiModule,
};

const selectedModules = unifiAuthServices[config.unifiControllerType];

authoriseRouter.route('/').post(async (req: Request, res: Response) => {
  try {
    logger.debug('Starting Unifi Login Attempt');
    await selectedModules.login();

    if (config.logAuthDriver) {
      await logAuth(req.body);
    }

    logger.debug('Starting Unifi Device Authorisation Attempt');
    await selectedModules.authorise(req);

    logger.debug(`Redirecting to  ${config.redirectUrl}`);
    res.redirect(config.redirectUrl);

    logger.debug('Starting Unifi Logout Attempt');
    await selectedModules.logout();
  } catch (err) {
    res.status(500).json({
      err: {
        message: 'An Error has occurred. Please try again.',
      },
    });
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
