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

import OpenAPIBackend, { Context } from 'openapi-backend';
import { Request, ResponseToolkit, ServerRoute, } from '@hapi/hapi';
import { ExternalPortalAggregate, IRoutes, ILogger, IPaymentTokenMapping } from '../domain';

const API_SPEC_FILE = './src/api-spec/payment-token-adapter-spec-externalPortal.yaml';

export class ExternalPortalRoutes implements IRoutes {
    private readonly routes: ServerRoute[] = [];
    private readonly coreConnectorAggregate: ExternalPortalAggregate;
    private readonly logger: ILogger;

    constructor(tokenAggregate: ExternalPortalAggregate, logger: ILogger) {
        this.coreConnectorAggregate = tokenAggregate;
        this.logger = logger;

        // initialise openapi backend with validation
        const api = new OpenAPIBackend({
            definition: API_SPEC_FILE,
            handlers: {
                registerToken: this.registerTokenMapping.bind(this),
                validationFail: async (context, req, h) => h.response({ error: context.validation.errors }).code(400),
                notFound: async (context, req, h) => h.response({ error: 'Not found' }).code(404),
            },
        });

        api.init();

        this.routes.push({
            method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            path: '/{path*}',
            handler: (req, h) => api.handleRequest( {
                method: req.method,
                path: req.path,
                body: req.payload,
                query: req.query,
                headers: req.headers,
            }, req, h),
        });
    }

    getRoutes(): ServerRoute[] {
        return this.routes;
    }

    private async registerTokenMapping(context: Context, req: Request, h: ResponseToolkit) {
        const { paymentToken, payeeIdType, payeeId} = req.payload as IPaymentTokenMapping;

        await this.coreConnectorAggregate.createMapping({
            paymentToken,
            payeeIdType,
            payeeId,
        });
        return h.response('OK').code(201);
    }
}
