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

"use strict";

import {IRoutes, SDKAggregate} from "../domain";
import {ServerRoute} from "hapi";
import {ReqRefDefaults} from "@hapi/hapi";
import OpenAPIBackend from 'openapi-backend';
import {SDKSchemeAdapter} from "@mojaloop/api-snippets";

export class SDKRoutes implements IRoutes {
    //@ts-expect-error ReqRefDefaults not found
    private readonly routes: ServerRoute<ReqRefDefaults>[] = [];
    private readonly sdkAggregate: SDKAggregate;

    constructor(sdkAggregate: SDKAggregate) {
        this.sdkAggregate = sdkAggregate;


        // initialise openapi backend with validation
        const api = new OpenAPIBackend({
            definition:"./src/api-spec/payment-token-adapter-spec-sdk.yaml",
            handlers:{
                getParties: this.getParties.bind(this),
                postQuotes: this.postQuotes.bind(this),
                transfer: this.transfer.bind(this),
                validationFail: async (context,req , h) =>
                    h.response({ err: context.validation.errors }).code(400),
                notFound: async (context, req, h) =>
                    h.response({ context, err: 'not found' }).code(404),
            },
        });

        api.init();


        this.routes.push({
            method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            path: '/{path*}',
            //@ts-expect-error h has no type
            handler: (req, h) =>
                api.handleRequest(
                    {
                        method: req.method,
                        path: req.path,
                        body: req.payload,
                        query: req.query,
                        headers: req.headers,
                    },
                    req,
                    h,
                ),
        });


    }

    //@ts-expect-error ReqRefDefaults not found
    getRoutes(): ServerRoute<ReqRefDefaults>[] {
        return this.routes;
    }

    //@ts-expect-error h has no type
    private async getParties(context, request: Hapi.Request, h: Hapi.ResponseToolkit){
        console.log("Received request: GET /parties");
        const params = context.request.params;

        const ID = params["ID"];
        const Type = params["IdType"];

        if(!ID || !Type){
            return h.response({statusCode:3107, message:"Missing mandatory extension parameter"}).code(400);
        }
        const result = await this.sdkAggregate.getParties(ID,Type);

        if(!result){
            return h.response({statusCode:3204,message:"ALIAS not found"}).code(404);
        }else if(typeof result == "string"){
            return h.response({statusCode:2001,message:"Internal server error"}).code(500);
        }else{
            return h.response(result.payload).code(200);
        }
    }

    //@ts-expect-error h has no type
    private async postQuotes(context, request: Hapi.Request, h: Hapi.ResponseToolkit){
        console.log("Received request: POST /quoterequests");

        const payload: SDKSchemeAdapter.V2_0_0.Backend.Types.quoteRequest = request.payload as SDKSchemeAdapter.V2_0_0.Backend.Types.quoteRequest;

        if(!payload.to){
            return h.response("Bad Request: Payload missing crucial info").code(400);
        }

        const result = await this.sdkAggregate.postQuotes(payload);
        if(!result){
            return h.response({statusCode:3204,message:"ALIAS not found"}).code(404);
        }else if(typeof result == "string"){
            return h.response({statusCode:2001,message:"Internal server error"}).code(500);
        }else{
            return h.response(result.payload).code(200);
        }
    }

    //@ts-expect-error h has no type
    private async transfer(context, request: Hapi.Request, h: Hapi.ResponseToolkit){
        console.log("Received request: POST /transfers ");

        const payload: SDKSchemeAdapter.V2_0_0.Backend.Types.transferRequest = request.payload as SDKSchemeAdapter.V2_0_0.Backend.Types.transferRequest;

        if(!payload.to){
            return h.response("Bad Request: Payload missing crucial info").code(400);
        }

        const result = await this.sdkAggregate.transfer(payload);
        if(!result){
            return h.response({statusCode:3204,message:"ALIAS not found"}).code(404);
        }else if(typeof result == "string"){
            return h.response({statusCode:2001,message:"Internal server error"}).code(500);
        }else{
            return h.response(result.payload).code(200);
        }
    }

}