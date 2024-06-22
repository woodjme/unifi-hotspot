import axios from 'axios';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import { CookieJar } from 'tough-cookie';
import { logger } from './logger';
import { config } from './config';

const jar = new CookieJar();

const instance = axios.create({
  baseURL: config.unifiControllerUrl,
  httpAgent: new HttpCookieAgent({
    jar,
  }),
  httpsAgent: new HttpsCookieAgent({
    jar,
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

export default instance;
