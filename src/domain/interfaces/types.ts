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

import { ServerRoute } from '@hapi/hapi';
import { SDKSchemeAdapter } from '@mojaloop/api-snippets';

export type TQuoteRequest = SDKSchemeAdapter.V2_0_0.Backend.Types.quoteRequest;

export type TTransferRequest = SDKSchemeAdapter.V2_0_0.Backend.Types.transferRequest;

export interface IPaymentTokenMapping {
    paymentToken: string;
    payeeId: string;
    payeeIdType: PayeeIdType;
}

export type Transfer = {
    completedTimestamp: string;
    fulfilment: string;
    homeTransactionId: string;
    transferState: string;
};

export type Quote = {
    expiration: string;
    extensionList: unknown[];
    geoCode: unknown;
    payeeFspCommissionAmount: string;
    payeeFspCommissionAmountCurrency: string;
    payeeFspFeeAmount: string;
    payeeFspFeeAmountCurrency: string;
    payeeReceiveAmount: string;
    payeeReceiveAmountCurrency: string;
    quoteId: string;
    transactionId: string;
    transferAmount: string;
    transferAmountCurrency: string;
};

// todo: rename to Party
export type Payee = {
    dateOfBirth: string;
    displayName: string;
    extensionList: unknown[];
    firstName: string;
    fspId: string;
    idSubValue: string;
    idType: PayeeIdType;
    idValue: string;
    lastName: string;
    merchantClassificationCode: string;
    middleName: string;
    type: string;
    supportedCurrencies: string;
    kycInformation: string;
};

export enum PayeeIdType {
    MSISDN = 'MSISDN',
    IBAN = 'IBAN',
    ACCOUNT_NO = 'ACCOUNT_NO',
    EMAIL = 'EMAIL',
    PERSONAL_ID = 'PERSONAL_ID',
    BUSINESS = 'BUSINESS',
    DEVICE = 'DEVICE',
    ACCOUNT_ID = 'ACCOUNT_ID',
    ALIAS = 'ALIAS',
}

export interface ISDKBackendClient {
  lookupPartyInfo(idType: PayeeIdType, id: string): Promise<Payee | null>;
  calculateQuote(payload: TQuoteRequest): Promise<Quote | null>;
  createTransfer(payload: TTransferRequest): Promise<Transfer | null>; // or performTransfer?
}

export interface IRoutes {
  getRoutes(): ServerRoute[];
}

