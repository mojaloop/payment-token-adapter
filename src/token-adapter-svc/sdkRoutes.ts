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
import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { TQuoteRequest, TTransferRequest, IRoutes, SDKAggregate, ILogger, PayeeIdType } from '../domain';

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
    }

    getRoutes(): ServerRoute[] {
        return this.routes;
    }

    private async getParties(context: Context, req: Request, h: ResponseToolkit) {
        this.logger.info('Received request: GET /parties');
        // todo: use middleware to log incoming requests details
        const { params} = context.request;
        const idType = params.IdType as PayeeIdType;
        const id = params.ID as string;

        const result = await this.sdkAggregate.getParties(idType, id);
        // todo: refactor
        if (!result) {
            return h.response({ statusCode: 3204, message: 'ALIAS not found' }).code(404);
        } else if (typeof result == 'string') {
            return h.response({ statusCode: 2001, message: 'Internal server error' }).code(500);
        } else {
            return h.response(result).code(200);
        }
    }

    private async postQuotes(context: Context, req: Request, h: ResponseToolkit) {
        this.logger.info('Received request: POST /quoterequests');
        // todo: use middleware to log incoming requests details

        const payload = req.payload as TQuoteRequest;

        // todo: add validation
        if (!payload.to) {
            return h.response('Bad Request: Payload missing crucial info').code(400);
        }

        const result = await this.sdkAggregate.postQuotes(payload);
        // todo: refactor
        if (!result) {
            return h.response({ statusCode: 3204, message: 'ALIAS not found' }).code(404);
        } else if (typeof result == 'string') {
            return h.response({ statusCode: 2001, message: 'Internal server error' }).code(500);
        } else {
            return h.response(result).code(200);
        }
    }

    private async transfer(context: Context, req: Request, h: ResponseToolkit) {
        this.logger.info('Received request: POST /transfers');
        // todo: use middleware to log incoming requests details

        const payload = req.payload as TTransferRequest;

        if (!payload.to) {
            return h.response('Bad Request: Payload missing crucial info').code(400);
        }

        const result = await this.sdkAggregate.transfer(payload);
        // todo: refactor
        if (!result) {
            return h.response({ statusCode: 3204, message: 'ALIAS not found' }).code(404);
        } else if (typeof result == 'string') {
            return h.response({ statusCode: 2001, message: 'Internal server error' }).code(500);
        } else {
            return h.response(result).code(200);
        }
    }
}
