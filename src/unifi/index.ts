// legacyUnifiModule.ts
import { AxiosResponse } from 'axios';
import { UnifiApiService } from '../interfaces/UnifiApiService';
import { logger } from '../utils/logger';
import axios from '../utils/axios';
import { config } from '../utils/config';


export const legacyUnifiModule: UnifiApiService = {
  login: async (): Promise<AxiosResponse<any>> => {
    try {
      logger.info('Unifi Login Attempt');
      const loginResponse = await axios.post('/api/login', JSON.stringify({
        username: config.unifiUsername,
        password: config.unifiPassword
      }));

      logger.info(loginResponse.data);

      if (loginResponse.data.meta.rc === 'ok') {
        logger.info('Unifi Login Successful');
        return loginResponse;
      } else {
        throw new Error('Unifi Login Failed: Incorrect Response');
      }
    } catch (err) {
      logger.error(err);
      throw err
    }
  },
  authorise: async (req: any): Promise<AxiosResponse<any>> => {
    try {
      const authorizeResponse = await axios.post(`/api/s/${config.unifiSiteName}/cmd/stamgr`,
      JSON.stringify({
        cmd: 'authorize-guest',
        mac: req.session.macAddr
      }));
      if (authorizeResponse.data.meta.rc === 'ok') {
        logger.info('Unifi Device Authorisation Successful')
        logger.info(authorizeResponse.data)
        return authorizeResponse
      } else {
        throw new Error('Unifi Device Authorisation Failed: Incorrect Response');
      }
    } catch (err) {
      logger.error(err);
      throw err
    }
  },
  logout: async (): Promise<AxiosResponse<any>> => {
    try {
      const logoutResponse = await axios.post('/api/logout');
      logger.info(logoutResponse.data);
      return logoutResponse;
    } catch (err) {
      logger.error(err);
      throw err
    }
  }
};


export const modernUnifiModule: UnifiApiService = {
  login: async (): Promise<AxiosResponse<any>> => {
    try {
      const loginResponse = await axios.post('/api/login', JSON.stringify({
        username: config.unifiUsername,
        password: process.env.UNIFI_PASS
      }));

      logger.info(loginResponse.data);

      if (loginResponse.data.meta.rc === 'ok') {
        logger.info('Unifi Login Successful');
        return loginResponse;
      } else {
        throw new Error('Unifi Login Failed: Incorrect Response');
      }
    } catch (err) {
      logger.error(err);
      throw err
    }
  },
  authorise: async (req: any) => {
    try {
      const authorizeResponse = await axios.post(`/proxy/network/api/s/default/cmd/stamgr`, req.body);
      logger.info(authorizeResponse.data);
      return authorizeResponse;
    } catch (err) {
      logger.error(err);
      throw err
    }
  },
  logout: async (): Promise<AxiosResponse<any>> => {
    try {
      const logoutResponse = await axios.post('/api/logout');
      logger.info(logoutResponse.data);
      return logoutResponse;
    } catch (err) {
      logger.error(err);
      throw err
    }
  }
};
