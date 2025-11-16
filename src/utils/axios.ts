import axios, { AxiosInstance } from 'axios';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';
import { CookieJar } from 'tough-cookie';
import { logger } from './logger';
import { config } from './config';
import { Request } from 'express';

/**
 * Detect UniFi controller URL from the request
 * The controller IP can be inferred from various sources
 */
export const detectControllerUrl = (req: Request): string | null => {
  // Try to extract from X-Forwarded-For header (if behind proxy)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor.split(',')[0];
    logger.debug(
      `Detected potential controller IP from X-Forwarded-For: ${ip}`,
    );
    return `https://${ip.trim()}`;
  }

  // Try to get the host from the referer header
  const referer = req.headers['referer'] || req.headers['referrer'];
  if (referer) {
    try {
      // Ensure referer is a string (headers can be string | string[])
      const refererString = Array.isArray(referer) ? referer[0] : referer;
      const url = new URL(refererString);
      logger.debug(`Detected controller URL from referer: ${url.origin}`);
      return url.origin;
    } catch (error) {
      logger.debug('Failed to parse referer URL');
    }
  }

  // Try to get from the request host
  const host = req.headers['host'];
  if (host) {
    // The request is to this server, but we can try to infer the gateway
    // This is less reliable but might work in some scenarios
    const protocol =
      req.secure || req.headers['x-forwarded-proto'] === 'https'
        ? 'https'
        : 'http';
    logger.debug(`Request host: ${protocol}://${host}`);
  }

  // Check if there's a gateway parameter in the query string
  // Some UniFi setups pass this information
  const gateway = req.query.gw || req.query.gateway;
  if (gateway && typeof gateway === 'string') {
    logger.debug(
      `Detected controller from gateway parameter: https://${gateway}`,
    );
    return `https://${gateway}`;
  }

  logger.debug('Could not detect controller URL from request');
  return null;
};

/**
 * Create an Axios instance for a specific controller URL
 */
export const createAxiosInstance = (
  controllerUrl?: string,
  req?: Request,
): AxiosInstance => {
  let baseURL = controllerUrl || config.unifiControllerUrl;

  // If URL is "auto" or not provided, try to detect it
  if (!baseURL || baseURL === 'auto') {
    if (req) {
      const detectedUrl = detectControllerUrl(req);
      if (detectedUrl) {
        baseURL = detectedUrl;
        logger.info(`Using auto-detected controller URL: ${baseURL}`);
      } else {
        logger.warn(
          'Failed to auto-detect controller URL, attempting to use configured fallback',
        );
        baseURL = config.unifiControllerUrl;
      }
    } else {
      logger.warn('Cannot auto-detect controller URL without request context');
      baseURL = config.unifiControllerUrl;
    }
  }

  const jar = new CookieJar();

  const instance = axios.create({
    baseURL,
    httpAgent: new HttpCookieAgent({ cookies: { jar } }),
    httpsAgent: new HttpsCookieAgent({
      cookies: { jar },
      rejectUnauthorized: false,
    }),
  });

  // Request interceptor
  instance.interceptors.request.use(
    (request) => {
      logger.debug(
        `Starting Request: ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`,
      );
      logger.debug(`Request Headers: ${JSON.stringify(request.headers)}`);
      if (request.data) {
        logger.debug(`Request Data: ${JSON.stringify(request.data)}`);
      }
      return request;
    },
    (error) => {
      logger.error(`Request Error: ${error.message}`);
      return Promise.reject();
    },
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      logger.info(
        `Response from ${response.config.url}: ${response.status} ${response.statusText}`,
      );
      logger.debug(`Response Headers: ${JSON.stringify(response.headers)}`);
      logger.debug(`Response Data: ${JSON.stringify(response.data)}`);
      return response;
    },
    (error) => {
      if (error.response) {
        logger.error(
          `Server responded with an error from ${error.response.config.url}: ${error.response.status} ${error.response.statusText}`,
        );
        logger.error(`Error Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        logger.error(`No response received: ${error.request}`);
      } else {
        logger.error(`Error: ${error.message}`);
      }
      return Promise.reject();
    },
  );

  return instance;
};
