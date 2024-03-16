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

import { IHttpClient, ITokenMappingStorageRepo } from 'domain/interfaces';
import { AxiosHttpClient, MemoryTokenMappingStorageRepo } from '../implementations';
import { ExternalPortalAggregate, SDKAggregate } from '../domain';
import { Server } from '@hapi/hapi';
import process from 'process';
import { ExternalPortalRoutes } from './externalPortalRoutes';
import { SDKRoutes } from './sdkRoutes';

const EXTERNAL_PORTAL_SERVER_PORT = process.env['SERVER_PORT'] || 3000;
const SDK_SERVER_PORT = process.env['SERVER_PORT'] || 3001;
const SERVER_HOST = process.env['SERVER_HOST'] || '0.0.0.0';
const CORE_CONNECTOR_URL = process.env['CORE_CONNECTOR_URL'] || 'http://localhost:4040';

export class Service {
    static tokenMappingStorageRepo: ITokenMappingStorageRepo;
    static externalPortalAggregate: ExternalPortalAggregate;
    static sdkAggregate: SDKAggregate;
    static externalPortalServer: Server;
    static sdkServer: Server;
    static httpClient: IHttpClient;

    static async start(aliasMappingStorageRepo?: ITokenMappingStorageRepo, httpClient?: IHttpClient) {
        if (!aliasMappingStorageRepo) {
            aliasMappingStorageRepo = new MemoryTokenMappingStorageRepo();
            await aliasMappingStorageRepo.init();
        }
        this.tokenMappingStorageRepo = aliasMappingStorageRepo;

        if (!httpClient) {
            httpClient = new AxiosHttpClient();
            await httpClient?.init();
        }
        this.httpClient = httpClient;

        this.externalPortalAggregate = new ExternalPortalAggregate(this.tokenMappingStorageRepo);
        this.sdkAggregate = new SDKAggregate(this.tokenMappingStorageRepo, this.httpClient, CORE_CONNECTOR_URL);

        await this.externalPortalAggregate.init();
        await this.sdkAggregate.init();

        // start server
        await this.setUpAndStartServers();
    }

    static async setUpAndStartServers(): Promise<void> {
        return new Promise<void>((resolve) => {
            // Start Hapi Server
            this.externalPortalServer = new Server({
                port: EXTERNAL_PORTAL_SERVER_PORT,
                host: SERVER_HOST,
            });

            this.sdkServer = new Server({
                port: SDK_SERVER_PORT,
                host: SERVER_HOST,
            });

            const externalPortalRoutes = new ExternalPortalRoutes(this.externalPortalAggregate);
            const sdkRoutes = new SDKRoutes(this.sdkAggregate);

            this.externalPortalServer.route(externalPortalRoutes.getRoutes());
            this.externalPortalServer.route({
                method: '*',
                path: '/{any*}',
                handler: function (request, h) {
                    return h.response('404 Error! Page Not Found!').code(404);
                },
            });

            this.sdkServer.route(sdkRoutes.getRoutes());
            this.sdkServer.route({
                method: '*',
                path: '/{any*}',
                handler: function (request, h) {
                    return h.response('404 Error! Page Not Found!').code(404);
                },
            });

            this.externalPortalServer.start();
            console.log('External Portal Server running on %s', this.externalPortalServer.info.uri);

            this.sdkServer.start();
            console.log('SDK Server running on %s', this.sdkServer.info.uri);

            resolve();
        });
    }

    static async stop() {
        // destroy aggregate and application
        await this.externalPortalAggregate.destroy();
        await this.sdkAggregate.destroy();
        await this.httpClient.destroy();
        console.log('wdqwd');
        await this.externalPortalServer.stop({ timeout: 60 });
        await this.sdkServer.stop({ timeout: 60 });
    }
}

async function _handle_int_and_term_signals(signal: NodeJS.Signals): Promise<void> {
    console.info(`Service - ${signal} received - cleaning up...`);
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
process.on(
    'exit',
    /* istanbul ignore next */ async () => {
        console.log('Service - exiting...');
    },
);
process.on(
    'uncaughtException',
    /* istanbul ignore next */ (err: Error) => {
        console.error(err);
        console.log('UncaughtException - EXITING...');
        process.exit(999);
    },
);
