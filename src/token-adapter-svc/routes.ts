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


import {ServerRoute} from "hapi";
import {Aggregate} from "../domain";
import {ReqRefDefaults} from "@hapi/hapi";
import {PayeeIdType} from '../interfaces';

export class TokenAdapterRoutes {
    //@ts-expect-error ReqRefDefaults not found
    private readonly routes: ServerRoute<ReqRefDefaults>[] = [];
    private readonly tokenAggregate: Aggregate;

    constructor(tokenAggregate: Aggregate) {

        this.tokenAggregate = tokenAggregate;

        // register token
        this.registerTokenMapping = this.registerTokenMapping.bind(this);
        this.routes.push({
            method: 'POST',
            path: '/tokens',
            handler: this.registerTokenMapping
        });

        // get Token
        this.getTokenMapping = this.getTokenMapping.bind(this);
        this.routes.push({
            method: 'GET',
            path: '/parties/{payeeIdType}/{payeeId}',
            handler: this.getTokenMapping
        });
    }

    getRoutes(){
        return this.routes;
    }

    //@ts-expect-error h has no type
    private async registerTokenMapping(request, h){
        console.log("Received request");
        const payload = request.payload;
        await this.tokenAggregate.createMapping(
            {
                paymentToken: payload.paymentToken,
                payeeIdType:
                     payload.payeeIdType == "IBAN" ? PayeeIdType.IBAN
                    : payload.payeeIdType == "MSISDN" ? PayeeIdType.MSISDN
                    : payload.payeeIdType == "ACCOUNT_NO" ? PayeeIdType.ACCOUNT_NO
                    : payload.payeeIdType == "EMAIL" ? PayeeIdType.EMAIL
                    : payload.payeeIdType == "PERSONAL_ID" ? PayeeIdType.PERSONAL_ID
                    : payload.payeeIdType == "BUSINESS" ? PayeeIdType.BUSINESS
                    : payload.payeeIdType == "DEVICE" ? PayeeIdType.DEVICE
                    : PayeeIdType.ACCOUNT_ID ,
                payeeId: payload.payeeId
            }
        );
        return h.response(`OK`).code(200);
    }

    //@ts-expect-error h has no type
    private async getTokenMapping(request, h){
        const params = request.params;

        if(!params.payeeId){
            h.response("Bad Request. Please specify Payment Token").code(400);
        }

        const tokenMapping = await this.tokenAggregate.getMapping(params.payeeId);
        if(!tokenMapping){
            return h.response({
                "statusCode":"4001",
                "message":"Party Not Found"
            }).code(404);
        }else{
            return h.response(tokenMapping).code(200);
        }
    }
}
