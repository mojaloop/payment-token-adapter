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

import {
    ISDKBackendClient,
    ITokenMappingStorageRepo,
    ILogger,
    PayeeIdType,
    TQuoteRequest,
    TTransferRequest,
    Payee,
    Quote,
    Transfer,
} from './interfaces';

export class SDKAggregate {
    constructor(
      private readonly aliasMappingRepo: ITokenMappingStorageRepo,
      private readonly sdkClient:ISDKBackendClient,
      private readonly logger: ILogger,
    ) {}

    async init() {
        await this.aliasMappingRepo.init();
        return true;
    }

    async destroy() {
        await this.aliasMappingRepo.destroy();
        return true;
    }


    // todo: avoid returning string
    async getParties(ID: string, Type: string): Promise<Payee | string> {
        if (Type == PayeeIdType.ALIAS) {
            const tokenMapping = await this.aliasMappingRepo.getMapping(ID);
            if (!tokenMapping) {
                this.logger.warn('no tokenMapping', { ID, Type });
                return '';
            }

            const res = await this.sdkClient.lookupPartyInfo(tokenMapping.payeeIdType, tokenMapping.payeeId);

            if (!res) {
                this.logger.error('no lookupPartyInfo results', { ID, Type });
                return 'Http Request Error';
                // todo: improve error handling
            }
            res.idValue = ID;
            res.idType = Type;

            return res;
        }

        const res = await this.sdkClient.lookupPartyInfo(Type, ID);
        if (!res) {
            return 'Http Request Error';
        }
        return res;
    }

    async postQuotes(payload: TQuoteRequest): Promise<Quote | string> {
        if (payload.to.idType == PayeeIdType.ALIAS) {
            const tokenMapping = await this.aliasMappingRepo.getMapping(payload.to.idValue);
            if (!tokenMapping) {
                this.logger.warn(`no tokenMapping by to.idValue: ${payload.to.idValue}`);
                return '';
            }

            // todo: avoid modifying input payload
            payload.to.idType = tokenMapping.payeeIdType;
            payload.to.idValue = tokenMapping.payeeId;
        }

        const res = await this.sdkClient.calculateQuote(payload);
        if (!res) {
            this.logger.error('no calculateQuote results:', { payload });
            return 'Http Request Error';
        }
        return res;
    }

    // todo: improve error handling
    async transfer(payload: TTransferRequest): Promise<Transfer | string> {
        if (payload.to.idType == PayeeIdType.ALIAS) {
            const tokenMapping = await this.aliasMappingRepo.getMapping(payload.to.idValue);
            if (!tokenMapping) {
                this.logger.warn(`no tokenMapping by to.idValue: ${payload.to.idValue}`);
                return '';
            }

            // todo: avoid modifying input payload
            payload.to.idType = tokenMapping.payeeIdType;
            payload.to.idValue = tokenMapping.payeeId;
        }

        const res = await this.sdkClient.createTransfer(payload);
        if (!res) {
            this.logger.error('no createTransfer results:', { payload });
            return 'Http Request Error';
        }
        return res;
    }

}
