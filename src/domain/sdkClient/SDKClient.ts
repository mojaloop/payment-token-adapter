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

    constructor(deps: TSDKClientDeps) {
        const logger = deps.logger.child({ context: this.constructor.name });
        this.logger = logger;
        this.http = deps.httpClientFactory({ logger });
        this.coreConnectorUrl = deps.coreConnectorUrl;
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
        // todo: improve error handling (check error type and fields)
        this.logger.error(`error while sending request to ${url}: ${(err as Error)?.stack}`);
        return null;
    }
}
