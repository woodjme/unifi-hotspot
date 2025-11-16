import { AxiosResponse, AxiosInstance } from 'axios';
import { ControllerConfig } from '../utils/config';

export interface UnifiApiService {
  login: (
    unifiApiClient: AxiosInstance,
    controllerConfig?: ControllerConfig,
  ) => Promise<AxiosResponse>;
  authorise: (
    unifiApiClient: AxiosInstance,
    req: any,
    controllerConfig?: ControllerConfig,
  ) => Promise<AxiosResponse>;
  logout: (unifiApiClient: AxiosInstance) => Promise<AxiosResponse>;
}
