import { AxiosResponse } from 'axios';

export interface UnifiApiService {
  login: () => Promise<AxiosResponse<any>>;
  authorise: (req: any) => Promise<AxiosResponse<any>>;
  logout: () => Promise<AxiosResponse<any>>;
}
