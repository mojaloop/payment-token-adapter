/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list (alphabetical ordering) of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.


 - Okello Ivan Elijah <elijahokello90@gmail.com>

 --------------
 ******/

'use strict';

import process from 'node:process';
import { Server } from '@hapi/hapi';

import { ExternalPortalAggregate, SDKAggregate, ITokenMappingStorageRepo, sdkClientFactory } from '../domain';
import { MemoryTokenMappingStorageRepo, loggerFactory } from '../infra';
import { loggingPlugin } from '../plugins';
import { ExternalPortalRoutes } from './externalPortalRoutes';
import { SDKRoutes } from './sdkRoutes';

// todo: use convict to deal with env vars;  make some envs required
const EXTERNAL_PORTAL_SERVER_PORT = process.env['EXTERNAL_PORTAL_SERVER_PORT'] || 3000;
const SDK_SERVER_PORT = process.env['SDK_SERVER_PORT'] || 3001;
const SERVER_HOST = process.env['SERVER_HOST'] || '0.0.0.0';
const CORE_CONNECTOR_URL = process.env['CORE_CONNECTOR_URL'] || 'http://localhost:4040';

const logger = loggerFactory({ context: 'PTA' });
const plugins = [{
    plugin: loggingPlugin,
    options: { logger },
}];
// add other plugins here


export class Service {
    static tokenMappingStorageRepo: ITokenMappingStorageRepo;
    static externalPortalAggregate: ExternalPortalAggregate;
    static sdkAggregate: SDKAggregate;
    static externalPortalServer: Server;
    static sdkServer: Server;

    static async start(aliasMappingStorageRepo?: ITokenMappingStorageRepo) {
        if (!aliasMappingStorageRepo) {
            aliasMappingStorageRepo = new MemoryTokenMappingStorageRepo();
            await aliasMappingStorageRepo.init();
        }
        this.tokenMappingStorageRepo = aliasMappingStorageRepo;

        this.externalPortalAggregate = new ExternalPortalAggregate(this.tokenMappingStorageRepo, logger);
        const sdkClient = sdkClientFactory({ coreConnectorUrl: CORE_CONNECTOR_URL });
        this.sdkAggregate = new SDKAggregate(this.tokenMappingStorageRepo, sdkClient, logger);

        await this.externalPortalAggregate.init();
        await this.sdkAggregate.init();

        // start server
        await this.setUpAndStartServers();
        logger.info('PTA is started', { EXTERNAL_PORTAL_SERVER_PORT, SDK_SERVER_PORT, CORE_CONNECTOR_URL });
    }

    static async setUpAndStartServers(): Promise<boolean> {
        // Start Hapi Server
        // todo: !! create a separate class HttpServer
        this.externalPortalServer = new Server({
            port: EXTERNAL_PORTAL_SERVER_PORT,
            host: SERVER_HOST,
        });
        await this.externalPortalServer.register(plugins);
        const externalPortalRoutes = new ExternalPortalRoutes(this.externalPortalAggregate, logger);
        this.externalPortalServer.route(externalPortalRoutes.getRoutes());

        this.sdkServer = new Server({
            port: SDK_SERVER_PORT,
            host: SERVER_HOST,
        });
        await this.sdkServer.register(plugins);
        const sdkRoutes = new SDKRoutes(this.sdkAggregate, logger);
        this.sdkServer.route(sdkRoutes.getRoutes());

        await Promise.all([
            this.externalPortalServer.start(),
            this.sdkServer.start(),
        ]);

        logger.info(`External Portal Server running on port ${this.externalPortalServer.info.uri}`);
        logger.info(`SDK Server running on port ${this.sdkServer.info.uri}`);

        return true;
    }

    // todo: refactor
    static async stop() {
        // destroy aggregate and application
        await this.externalPortalAggregate.destroy();
        await this.sdkAggregate.destroy();
        await this.externalPortalServer.stop({ timeout: 60 });
        await this.sdkServer.stop({ timeout: 60 });
        logger.info('service is stopped');
    }
}

// todo: refactor it and move to /src/index.ts
async function _handle_int_and_term_signals(signal: NodeJS.Signals): Promise<void> {
    logger.warn(`Service - ${signal} received - cleaning up...`);
    let clean_exit = false;
    setTimeout(() => {
        clean_exit || process.abort();
    }, 5000);

    // call graceful stop routine
    await Service.stop();

    clean_exit = true;
    process.exit();
}

//catches ctrl+c event
process.on('SIGINT', _handle_int_and_term_signals.bind(this));
//catches program termination event
process.on('SIGTERM', _handle_int_and_term_signals.bind(this));

//do something when app is closing
/* istanbul ignore next */
process.on('exit', async () => {
    logger.info('Service - exiting...');
});

/* istanbul ignore next */
process.on('uncaughtException',(err: Error) => {
    logger.error(`UncaughtException: ${err?.message}`, err);
    process.exit(999);
});
