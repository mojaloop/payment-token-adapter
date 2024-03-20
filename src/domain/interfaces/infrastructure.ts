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

import { IPaymentTokenMapping } from './types';
import { TJson } from '../../infra';

export interface ITokenMappingStorageRepo {
    init(): Promise<void>;
    destroy(): Promise<void>;
    storeMapping(tokenMapping: IPaymentTokenMapping): Promise<void>;
    getMapping(mappingID: string): Promise<IPaymentTokenMapping | undefined>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TLogMethod = (message: string, meta?: any) => void;
// todo: - think, if message should be only string
//       - how to pass Error object
//       - what type meta should have?

export interface ILogger { // based on @mojaloop/central-services-logger impl.
    error: TLogMethod;
    warn: TLogMethod;
    trace: TLogMethod;
    info: TLogMethod;
    verbose: TLogMethod;
    debug: TLogMethod;
    silly: TLogMethod;
    child(context?: TJson): ILogger;
}
