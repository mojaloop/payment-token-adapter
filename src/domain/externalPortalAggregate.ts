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

import { ITokenMappingStorageRepo, IPaymentTokenMapping, ILogger } from './interfaces';

export class ExternalPortalAggregate {
    constructor(
      private readonly aliasMappingRepo: ITokenMappingStorageRepo,
      private readonly logger: ILogger,
    ) {}

    async init() {
        await this.aliasMappingRepo.init();
        return true;
    }

    async createMapping(tokenMapping: IPaymentTokenMapping) {
        this.logger.info('creating tokenMapping', { tokenMapping });
        await this.aliasMappingRepo.storeMapping(tokenMapping);
    }

    async getMapping(paymentToken: string): Promise<IPaymentTokenMapping | undefined> {
        this.logger.info('getting tokenMapping by paymentToken', { paymentToken });
        return await this.aliasMappingRepo.getMapping(paymentToken);
    }

    async destroy() {
        await this.aliasMappingRepo.destroy();
        return true;
    }
}
