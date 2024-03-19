import { httpClientFactory as createHttpClient, loggerFactory } from '../../infra';
import { ISDKBackendClient } from '../interfaces';
import { SDKClient, TSDKClientFactoryDeps } from './SDKClient';

export type TSDKClientFactory = (deps: TSDKClientFactoryDeps) => ISDKBackendClient;

export const sdkClientFactory: TSDKClientFactory = ({
    coreConnectorUrl,
    httpClientFactory = createHttpClient,
    logger = loggerFactory({ context: 'sdkClient' }),
} : TSDKClientFactoryDeps) => {
    return new SDKClient({ coreConnectorUrl, httpClientFactory, logger });
};
