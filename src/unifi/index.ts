// standaloneUnifiModule.ts
import { AxiosInstance, AxiosResponse } from 'axios';
import { UnifiApiService } from '../interfaces/UnifiApiService';
import { logger } from '../utils/logger';
import { config } from '../utils/config';

export const standaloneUnifiModule: UnifiApiService = {
  login: async (unifiApiClient: AxiosInstance): Promise<AxiosResponse> => {
    const loginResponse = await unifiApiClient.post('/api/login', {
      username: config.unifiUsername,
      password: config.unifiPassword,
    });

    if (loginResponse.data.meta.rc === 'ok') {
      logger.debug('Unifi Login Successful');
      return loginResponse;
    } else {
      throw new Error('Unifi Login Failed: Incorrect Response');
    }
  },
  authorise: async (
    unifiApiClient: AxiosInstance,
    req: any,
  ): Promise<AxiosResponse> => {
    const authorizeResponse = await unifiApiClient.post(
      `/api/s/${config.unifiSiteIdentifier}/cmd/stamgr`,
      JSON.stringify({
        cmd: 'authorize-guest',
        mac: req.session.macAddr,
      }),
    );
    if (authorizeResponse.data.meta.rc === 'ok') {
      logger.debug('Unifi Device Authorisation Successful');
      return authorizeResponse;
    } else {
      throw new Error('Unifi Device Authorisation Failed: Incorrect Response');
    }
  },
  logout: async (unifiApiClient: AxiosInstance): Promise<AxiosResponse> => {
    const logoutResponse = await unifiApiClient.post('/api/logout');
    return logoutResponse;
  },
};

export const integratedUnifiModule: UnifiApiService = {
  login: async (unifiApiClient: AxiosInstance): Promise<AxiosResponse> => {
    const loginResponse = await unifiApiClient.post('/api/auth/login', {
      username: config.unifiUsername,
      password: config.unifiPassword,
    });
    unifiApiClient.defaults.headers.common['x-csrf-token'] =
      loginResponse.headers['x-csrf-token'];
    if (loginResponse.status === 200) {
      unifiApiClient.defaults.headers.common['x-csrf-token'] =
        loginResponse.headers['x-csrf-token'];
      return loginResponse;
    } else {
      throw new Error(
        'Unifi Login Failed: Incorrect Response from Unifi Controller',
      );
    }
  },
  authorise: async (
    unifiApiClient: AxiosInstance,
    req: any,
  ): Promise<AxiosResponse> => {
    const authorizeResponse = await unifiApiClient.post(
      `/proxy/network/api/s/${config.unifiSiteIdentifier}/cmd/stamgr`,
      JSON.stringify({
        cmd: 'authorize-guest',
        mac: req.session.macAddr,
      }),
    );
    return authorizeResponse;
  },
  logout: async (unifiApiClient: AxiosInstance): Promise<AxiosResponse> => {
    const logoutResponse = await unifiApiClient.post('/api/auth/logout');
    return logoutResponse;
  },
};
