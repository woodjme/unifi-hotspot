import { AxiosResponse, AxiosInstance } from 'axios';

export interface UnifiApiService {
  login: (unifiApiClient: AxiosInstance) => Promise<AxiosResponse>;
  authorise: (
    unifiApiClient: AxiosInstance,
    req: any,
  ) => Promise<AxiosResponse>;
  logout: (unifiApiClient: AxiosInstance) => Promise<AxiosResponse>;
}
