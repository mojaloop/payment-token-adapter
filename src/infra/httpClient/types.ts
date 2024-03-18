import { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { ILogger } from '@mojaloop/logging-bc-public-types-lib';

export type TJson =
  | string
  | number
  | boolean
  | { [x: string]: TJson }
  | Array<TJson>;

export type THttpRequestOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;

export type THttpResponse<R> = {
  data: R;
  statusCode: number;
  // error: HttpError
}

export type THttpClientDeps = {
  options: CreateAxiosDefaults, // think, if it should be THttpRequestOptions
  logger: ILogger
};

// todo: think, if we need to return statusCode
export interface IHttpClient {
  get<R = unknown>(url: string, options?: THttpRequestOptions): Promise<THttpResponse<R>>;
  post<D extends TJson, R = unknown>(url: string, data: D, options?: THttpRequestOptions): Promise<THttpResponse<R>>;
  put<D extends TJson, R = unknown>(url: string, data: D, options?: THttpRequestOptions): Promise<THttpResponse<R>>;
  // todo: add other methods
  send<R = unknown>(options: AxiosRequestConfig): Promise<THttpResponse<R>>;
}

export type THttpClientFactoryDeps = Partial<THttpClientDeps>;

export type THttpClientFactory = (deps?: THttpClientFactoryDeps) => IHttpClient;
