/*****
License
--------------
Copyright © 2020-2025 Mojaloop Foundation
The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Contributors
--------------
This is the official list of the Mojaloop project contributors for this file.
Names of the original copyright holders (individuals or organizations)
should be listed with a '*' in the first column. People who have
contributed from an organization can be listed under the organization
that actually holds the copyright for their contributions (see the
Mojaloop Foundation for an example). Those individuals should have
their names indented and be marked with a '-'. Email address can be added
optionally within square brackets <email>.

* Mojaloop Foundation
- Name Surname <name.surname@mojaloop.io>

- Okello Ivan Elijah <elijahokello90@gmail.com>
*****/

'use strict';

import OpenAPIBackend, { Context } from 'openapi-backend';
import { Request, ResponseToolkit, ServerRoute, ResponseValue } from '@hapi/hapi';
import {
    SDKAggregate,
    TQuoteRequest,
    TTransferRequest,
    IRoutes,
    ILogger,
    PayeeIdType,
} from '../domain';

const API_SPEC_FILE = './src/api-spec/payment-token-adapter-spec-sdk.yaml';

export class SDKRoutes implements IRoutes {
    private readonly routes: ServerRoute[] = [];
    private readonly sdkAggregate: SDKAggregate;
    private readonly logger: ILogger;

    constructor(sdkAggregate: SDKAggregate, logger: ILogger) {
        this.sdkAggregate = sdkAggregate;
        this.logger = logger;

        // initialise openapi backend with validation
        const api = new OpenAPIBackend({
            definition: API_SPEC_FILE,
            handlers: {
                getParties: this.getParties.bind(this),
                postQuotes: this.postQuotes.bind(this),
                transfer: this.transfer.bind(this),
                validationFail: async (context, req, h) => h.response({ error: context.validation.errors }).code(400),
                notFound: async (context, req, h) => h.response({ error: 'Not found' }).code(404),
            },
        });

        api.init(); // todo: remove async method from ctor

        this.routes.push({
            method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            path: '/{path*}',
            handler: (req: Request, h: ResponseToolkit) => api.handleRequest({
                method: req.method,
                path: req.path,
                body: req.payload,
                query: req.query,
                headers: req.headers,
            }, req, h),
        });

        this.routes.push({
            method: ['GET'],
            path: '/health',
            handler: async (req: Request, h: ResponseToolkit) => {
                const success = true; // todo: think about better healthCheck logic
                return h.response({ success }).code(success ? 200 : 503);
            }
        });

    }

    getRoutes(): ServerRoute[] {
        return this.routes;
    }

    private async getParties(context: Context, req: Request, h: ResponseToolkit) {
        const { params} = context.request;
        const idType = params.IdType as PayeeIdType;
        const id = params.ID as string;

        const result = await this.sdkAggregate.getParties(idType, id);
        return this.prepareResponse(result, h);
    }

    private async postQuotes(context: Context, req: Request, h: ResponseToolkit) {
        const payload = req.payload as TQuoteRequest;
        const result = await this.sdkAggregate.postQuotes(payload);
        return this.prepareResponse(result, h);
    }

    private async transfer(context: Context, req: Request, h: ResponseToolkit) {
        const payload = req.payload as TTransferRequest;
        const result = await this.sdkAggregate.transfer(payload);
        return this.prepareResponse(result, h);
    }

    // todo: improve logic
    private async prepareResponse(result: ResponseValue, h: ResponseToolkit) {
        if (!result) {
            return h.response({ statusCode: 3204, message: 'ALIAS not found' }).code(404);
        } else if (typeof result == 'string') {
            return h.response({ statusCode: 2001, message: 'Internal server error' }).code(500);
        } else {
            return h.response(result).code(200);
        }
    }
}
