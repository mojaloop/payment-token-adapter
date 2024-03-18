import { DefaultLogger } from '@mojaloop/logging-bc-client-lib';
import { httpClientFactory as createHttpClient } from '../../infra';
import { ISDKBackendClient } from '../interfaces';
import { SDKClient, TSDKClientFactoryDeps } from './SDKClient';

export type TSDKClientFactory = (deps: TSDKClientFactoryDeps) => ISDKBackendClient;

export const sdkClientFactory: TSDKClientFactory = ({
    coreConnectorUrl,
    httpClientFactory = createHttpClient,
    logger = new DefaultLogger('PTA', 'sdkClient', ''),
} : TSDKClientFactoryDeps) => {
    return new SDKClient({ coreConnectorUrl, httpClientFactory, logger });
};
