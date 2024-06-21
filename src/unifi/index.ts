// legacyUnifiModule.ts
import { AxiosResponse } from 'axios';
import { UnifiApiService } from '../interfaces/UnifiApiService';
import { logger } from '../utils/logger';
import unifiApiClient from '../utils/axios';
import { config } from '../utils/config';

export const legacyUnifiModule: UnifiApiService = {
  login: async (): Promise<AxiosResponse> => {
    const loginResponse = await unifiApiClient.post('/api/login', {
      username: config.unifiUsername,
      password: config.unifiPassword,
    });

    if (loginResponse.data.meta.rc === 'ok') {
      logger.info('Unifi Login Successful');
      return loginResponse;
    } else {
      throw new Error('Unifi Login Failed: Incorrect Response');
    }
  },
  authorise: async (req: any): Promise<AxiosResponse> => {
    const authorizeResponse = await unifiApiClient.post(
      `/api/s/${config.unifiSiteName}/cmd/stamgr`,
      JSON.stringify({
        cmd: 'authorize-guest',
        mac: req.session.macAddr,
      }),
    );
    if (authorizeResponse.data.meta.rc === 'ok') {
      logger.info('Unifi Device Authorisation Successful');
      logger.info(authorizeResponse.data);
      return authorizeResponse;
    } else {
      throw new Error('Unifi Device Authorisation Failed: Incorrect Response');
    }
  },
  logout: async (): Promise<AxiosResponse> => {
    const logoutResponse = await unifiApiClient.post('/api/logout');
    return logoutResponse;
  },
};

export const modernUnifiModule: UnifiApiService = {
  login: async (): Promise<AxiosResponse> => {
    const loginResponse = await unifiApiClient.post('/api/auth/login', {
      username: config.unifiUsername,
      password: config.unifiPassword,
    });

    const permissions = loginResponse.data.permissions;
    if (
      permissions &&
      permissions['network.management']?.includes('hotspotoperator')
    ) {
      return loginResponse;
    } else {
      throw new Error(
        'Unifi Login Failed: Incorrect Response from Unifi Controller',
      );
    }
  },
  authorise: async (req: any): Promise<AxiosResponse> => {
    const authorizeResponse = await unifiApiClient.post(
      `/proxy/network/api/s/default/cmd/stamgr`,
      req.body,
    );
    return authorizeResponse;
  },
  logout: async (): Promise<AxiosResponse> => {
    const logoutResponse = await unifiApiClient.post('/api/logout');
    return logoutResponse;
  },
};
