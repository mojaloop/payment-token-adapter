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


import {IHttpClient, ITokenMappingStorageRepo, PayeeIdType} from "./interfaces";

export class SDKAggregate{

    private aliasMappingRepo: ITokenMappingStorageRepo;
    private httpClient: IHttpClient;
    private httpTimeOutMs: number;
    private readonly CORE_CONNECTOR_URL: string;

    constructor(aliasMappingRepo: ITokenMappingStorageRepo, httpClient: IHttpClient, CORE_CONNECTOR_URL: string) {
        this.aliasMappingRepo = aliasMappingRepo;
        this.httpClient = httpClient;
        this.CORE_CONNECTOR_URL = CORE_CONNECTOR_URL;
    }

    async init(){
        await this.aliasMappingRepo.init();
        return Promise.resolve();
    }

    async destroy(){
        await this.aliasMappingRepo.destroy();
        return Promise.resolve();
    }


    async getParties(ID: string, Type: string): Promise<string | undefined>{
        if(Type == PayeeIdType.ALIAS){
            const tokenMapping = await this.aliasMappingRepo.getMapping(ID);
            if(!tokenMapping){
                return ;
            }

            await this.httpClient.send(
                `${this.CORE_CONNECTOR_URL}/${tokenMapping.payeeIdType}/${tokenMapping.payeeId}`,
                undefined,
                this.httpTimeOutMs,
                "GET"
            );
            return "Substitution";
        }

        await this.httpClient.send(
            `${this.CORE_CONNECTOR_URL}/${Type}/${ID}`,
            undefined,
            this.httpTimeOutMs,
            "GET"
        );
        return "PassThrough";
    }
}