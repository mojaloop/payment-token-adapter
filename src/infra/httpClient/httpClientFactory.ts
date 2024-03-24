import { CreateAxiosDefaults } from 'axios';
import { loggerFactory } from '../Logger';
import { HttpClient } from './HttpClient';
import { THttpClientFactory, THttpClientFactoryDeps } from './types';

export const defaultHttpOptions: CreateAxiosDefaults = Object.freeze({
    timeout: 100000,
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
    logger = loggerFactory({ context: 'http' })
}: THttpClientFactoryDeps = {}) => {
    return new HttpClient({ options, logger });
};

