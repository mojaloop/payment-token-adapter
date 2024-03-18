import { CreateAxiosDefaults } from 'axios';
import { DefaultLogger } from '@mojaloop/logging-bc-client-lib';
import { HttpClient } from './HttpClient';
import { THttpClientFactory, THttpClientFactoryDeps } from './types';

export const defaultHttpOptions: CreateAxiosDefaults = Object.freeze({
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    transitional: {
        clarifyTimeoutError: true, // to throw ETIMEDOUT error instead of generic ECONNABORTED on request timeouts
    },
});

export const httpClientFactory: THttpClientFactory = ({
    options = defaultHttpOptions,
    logger = new DefaultLogger('PTA', 'http', '')
}: THttpClientFactoryDeps = {}) => {
    return new HttpClient({ options, logger });
};
