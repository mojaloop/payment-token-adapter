import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ILogger } from '@mojaloop/logging-bc-public-types-lib';
import {
    IHttpClient,
    THttpClientDeps,
    THttpRequestOptions,
    THttpResponse,
    TJson
} from './types';

export class HttpClient implements IHttpClient {
    private readonly axios: AxiosInstance;
    private readonly logger: ILogger;

    constructor(deps: THttpClientDeps) {
        this.axios = axios.create(deps.options);
        this.logger = deps.logger.createChild(this.constructor.name);
    }

    async get<R = unknown>(url: string, options?: THttpRequestOptions): Promise<THttpResponse<R>> {
        const res = await this.axios.get<R>(url, options);
        return this.responseDto(res);
    }

    async post<D extends TJson, R = unknown>(url: string, data: D, options?: THttpRequestOptions): Promise<THttpResponse<R>> {
        const res = await this.axios.post<R>(url, data, options);
        return this.responseDto(res);
    }

    async put<D extends TJson, R = unknown>(url: string, data: D, options?: THttpRequestOptions): Promise<THttpResponse<R>> {
        const res = await this.axios.put<R>(url, data, options);
        return this.responseDto(res);
    }

    async send<R = unknown>(options: AxiosRequestConfig): Promise<THttpResponse<R>> {
        const res = await this.axios.request<R>(options);
        return this.responseDto(res);
    }

    private responseDto(rawResponse: AxiosResponse) {
        const { data, status } = rawResponse;
        const json = Object.freeze({
            data,
            statusCode: status
        });
        this.logger.info('got http response:', json);
        return json;
    }
}

