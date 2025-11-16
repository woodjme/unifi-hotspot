import express, { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { webhook, googleSheets } from '../utils/logAuthDrivers';
import { config, UnifiControllerType, ControllerConfig } from '../utils/config';
import { createAxiosInstance } from '../utils/axios';
import { AxiosInstance } from 'axios';

import { UnifiApiService } from '../interfaces/UnifiApiService';
import { standaloneUnifiModule, integratedUnifiModule } from '../unifi/index';

const authoriseRouter = express.Router();

const unifiAuthServices: Record<UnifiControllerType, UnifiApiService> = {
  standalone: standaloneUnifiModule,
  integrated: integratedUnifiModule,
};

/**
 * Authorize a guest on a single controller
 */
async function authorizeOnController(
  controllerConfig: ControllerConfig,
  req: Request,
): Promise<{ success: boolean; error?: string }> {
  try {
    const unifiApiClient = createAxiosInstance(controllerConfig.url, req);
    const selectedModule = unifiAuthServices[controllerConfig.type];

    logger.info(
      `Authorizing on controller: ${controllerConfig.url || 'auto-detect'} (${controllerConfig.type})`,
    );

    // Login to controller with controller-specific credentials
    await selectedModule.login(unifiApiClient, controllerConfig);

    // Authorize the device
    await selectedModule.authorise(unifiApiClient, req, controllerConfig);

    // Logout from controller
    await selectedModule.logout(unifiApiClient);

    logger.info(
      `Successfully authorized on controller: ${controllerConfig.url || 'auto-detect'}`,
    );
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown error';
    logger.error(
      `Failed to authorize on controller ${controllerConfig.url || 'auto-detect'}: ${errorMsg}`,
    );
    return { success: false, error: errorMsg };
  }
}

/**
 * Legacy single-controller authorization
 */
async function legacyAuthorize(req: Request, res: Response): Promise<void> {
  const unifiApiClient = createAxiosInstance(undefined, req);
  const selectedModules = unifiAuthServices[config.unifiControllerType];

  logger.debug('Starting Unifi Login Attempt');
  await selectedModules.login(unifiApiClient);

  if (config.logAuthDriver) {
    await logAuth(req.body);
  }

  logger.debug('Starting Unifi Device Authorisation Attempt');
  await selectedModules.authorise(unifiApiClient, req);

  if (config.showConnecting === 'true') {
    logger.debug(`Redirecting to ${'./connecting'}`);
    res.redirect('./connecting');
  }

  if (
    config.showConnecting === 'false' &&
    config.serverSideRedirect === 'true'
  ) {
    // sleep 5s
    await new Promise((r) => setTimeout(r, 5000));
    logger.debug(`Redirecting to ${config.redirectUrl}`);
    res.redirect(config.redirectUrl);
  }

  logger.debug('Starting Unifi Logout Attempt');
  await selectedModules.logout(unifiApiClient);
}

/**
 * Multi-controller authorization
 */
async function multiControllerAuthorize(
  req: Request,
  res: Response,
): Promise<void> {
  const enabledControllers = config.unifiControllers.filter(
    (ctrl) => ctrl.enabled,
  );

  logger.info(
    `Authorizing guest on ${enabledControllers.length} controller(s)`,
  );

  // Log user authentication first
  if (config.logAuthDriver) {
    await logAuth(req.body);
  }

  // Authorize on all controllers in parallel
  const results = await Promise.allSettled(
    enabledControllers.map((ctrl) => authorizeOnController(ctrl, req)),
  );

  // Check results
  const successes = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success,
  );
  const failures = results.filter(
    (r) =>
      r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success),
  );

  logger.info(
    `Authorization complete: ${successes.length} succeeded, ${failures.length} failed`,
  );

  // If at least one succeeded, consider it a success
  if (successes.length > 0) {
    if (config.showConnecting === 'true') {
      logger.debug(`Redirecting to ${'./connecting'}`);
      res.redirect('./connecting');
    } else if (config.serverSideRedirect === 'true') {
      // sleep 5s
      await new Promise((r) => setTimeout(r, 5000));
      logger.debug(`Redirecting to ${config.redirectUrl}`);
      res.redirect(config.redirectUrl);
    } else {
      res.status(200).json({ success: true });
    }
  } else {
    // All controllers failed
    throw new Error('Failed to authorize on all controllers');
  }
}

authoriseRouter.route('/').post(async (req: Request, res: Response) => {
  try {
    if (config.enableMultiController) {
      await multiControllerAuthorize(req, res);
    } else {
      await legacyAuthorize(req, res);
    }
  } catch (err) {
    logger.error('Authorization error:', err);
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
