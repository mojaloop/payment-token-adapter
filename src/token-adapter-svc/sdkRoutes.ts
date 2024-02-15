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

export class SDKRoutes implements IRoutes {
    //@ts-expect-error ReqRefDefaults not found
    private readonly routes: ServerRoute<ReqRefDefaults>[] = [];
    private readonly sdkAggregate: SDKAggregate;

    constructor(sdkAggregate: SDKAggregate) {
        this.sdkAggregate = sdkAggregate;

        // get parties
        this.getParties = this.getParties.bind(this);
        this.routes.push({
            method:"GET",
            path:"/parties/{Type}/{ID}",
            handler: this.getParties
        });
    }

    //@ts-expect-error ReqRefDefaults not found
    getRoutes(): ServerRoute<ReqRefDefaults>[] {
        return this.routes;
    }

    //@ts-expect-error h has no type
    private async getParties(request, h){
        const params = request.params;

        const ID = params["ID"];
        const Type = params["Type"];

        if(!ID || !Type){
            return h.response({statusCode:3107, message:"Missing mandatory extension parameter"}).code(400);
        }
        const result = await this.sdkAggregate.getParties(ID,Type);

        if(!result){
            return h.response({statusCode:3204,message:"Party not found"}).code(404);
        }else if(typeof result == "string"){
            return h.response({statusCode:2001,message:"Internal server error"}).code(500);
        }else{
            return h.response(result.payload).code(200);
        }
    }

}