import { AxiosError } from 'axios';
import { IHttpClient, THttpClientFactory } from '../../infra';
import {
    ISDKBackendClient,
    ILogger,
    TQuoteRequest,
    TTransferRequest,
    Payee,
    Quote,
    Transfer,
} from '../interfaces';

export type TSDKClientDeps = {
  httpClientFactory: THttpClientFactory;
  logger: ILogger;
  coreConnectorUrl: string;
  reThrowHttpError?: boolean;
}

// todo: use TSDKClientDeps to make TSDKClientFactoryDeps (make some fields optional)
export type TSDKClientFactoryDeps = {
    httpClientFactory?: THttpClientFactory;
    logger?: ILogger;
    coreConnectorUrl: string;
}

export const ROUTES = Object.freeze({
    parties: 'parties',
    quoteRequests: 'quoterequests',
    transfers: 'transfers'
});

export class SDKClient implements ISDKBackendClient {
    private readonly http: IHttpClient;
    private readonly logger: ILogger;
    private readonly coreConnectorUrl: string; // think, if we can make it as BaseUrl of httpClient
    private readonly reThrowHttpError: boolean;

    constructor(deps: TSDKClientDeps) {
        const logger = deps.logger.child({ context: this.constructor.name });
        this.logger = logger;
        this.http = deps.httpClientFactory({ logger });
        this.coreConnectorUrl = deps.coreConnectorUrl;
        this.reThrowHttpError = deps.reThrowHttpError || false;
    }

    async lookupPartyInfo(idType: string, id: string): Promise<Payee | null> {
        const url = `${this.coreConnectorUrl}/${ROUTES.parties}/${idType}/${id}`;
        try {
            const { data } = await this.http.get<Payee>(url);
            this.logger.info('lookupPartyInfo result:', { url, data });
            return data;
        } catch (err) {
            return this.handleError(err, url);
        }
    }

    async calculateQuote(payload: TQuoteRequest): Promise<Quote | null> {
        const url = `${this.coreConnectorUrl}/${ROUTES.quoteRequests}`;
        try {
            const { data } = await this.http.post<TQuoteRequest, Quote>(url, payload);
            this.logger.info('calculateQuote result:', { url, data });
            return data;
        } catch (err) {
            return this.handleError(err, url);
        }
    }

    async createTransfer(payload: TTransferRequest): Promise<Transfer | null> {
        const url = `${this.coreConnectorUrl}/${ROUTES.transfers}`;
        try {
            const { data } = await this.http.post<TTransferRequest, Transfer>(url, payload);
            this.logger.info('createTransfer result:', { url, data });
            return data;
        } catch (err) {
            return this.handleError(err, url);
        }
    }

    private handleError(err: unknown, url: string): null {
        const { message, code, stack } = err as AxiosError;
        this.logger.error(`error on sending http request to ${url}: ${message}`, { code, stack });

        if (this.reThrowHttpError) throw err;

        return null;
    }
}
