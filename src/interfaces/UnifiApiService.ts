import { AxiosResponse } from 'axios';

export interface UnifiApiService {
  login: () => Promise<AxiosResponse>;
  authorise: (req: any) => Promise<AxiosResponse>;
  logout: () => Promise<AxiosResponse>;
}
