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

import {IHttpClient, IHttpResponse, ITokenMappingStorageRepo} from 'domain/interfaces';
import {IPaymentTokenMapping} from 'domain/interfaces';
import axios from 'axios';

export class MemoryTokenMappingStorageRepo implements ITokenMappingStorageRepo{
    private mappings = new Map<string, IPaymentTokenMapping>;

    destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }

    getMapping(mappingID: string): Promise<IPaymentTokenMapping | undefined> {
        // in the aggregate make sure to check if the returned mapping is defined
        return Promise.resolve(this.mappings.get(mappingID));
    }

    init(): Promise<void> {
        return Promise.resolve(undefined);
    }

    storeMapping(tokenMapping: IPaymentTokenMapping): Promise<void> {
        this.mappings.set(tokenMapping.paymentToken,tokenMapping);
        return Promise.resolve();
    }

}

export class AxiosHttpClient implements IHttpClient {
    async destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async init(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async send(url: string, payload: unknown | undefined, timeout_ms: number, method: string, headers: unknown | undefined): Promise<IHttpResponse | undefined> {
        try{
            const res = await axios.request({
                url: url,
                method: method,
                data: payload ? payload : undefined,
                timeout: timeout_ms,
                headers: headers ? headers : undefined
            });
            return Promise.resolve({payload: res.data});
        }catch (e: unknown) {
            console.error(e);
            return ;
        }
    }

}

