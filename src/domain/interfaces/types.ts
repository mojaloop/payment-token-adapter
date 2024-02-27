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
import {ReqRefDefaults} from "@hapi/hapi";

export interface IPaymentTokenMapping {
    paymentToken: string;
    payeeId: string;
    payeeIdType: PayeeIdType
}

export type IHttpResponse = {
    payload : Payee | Quote | Transfer
}

export type Transfer = {
    completedTimestamp: string,
    fulfilment: string,
    homeTransactionId: string,
    transferState: string
}

export type ITransferRequest = {
    homeR2PTransactionId: string
    amount: string,
    amountType: string,
    currency: string,
    from: unknown,
    ilpPacket: unknown,
    note: string,
    quote: Quote,
    quoteRequestExtensions: string,
    subScenario: string,
    to: Payee,
    transactionType: string,
    transferId: string,
    transactionRequestId: string
}

export type Quote = {
    expiration: string,
    extensionList: unknown[],
    geoCode: unknown,
    payeeFspCommissionAmount: string,
    payeeFspCommissionAmountCurrency: string,
    payeeFspFeeAmount: string,
    payeeFspFeeAmountCurrency: string,
    payeeReceiveAmount: string,
    payeeReceiveAmountCurrency: string,
    quoteId: string,
    transactionId: string,
    transferAmount: string,
    transferAmountCurrency: string
}

export type Payee = {
    dateOfBirth: string,
    displayName: string,
    extensionList: unknown[],
    firstName: string,
    fspId: string,
    idSubValue: string,
    idType: string,
    idValue: string,
    lastName: string,
    merchantClassificationCode: string,
    middleName: string,
    type: string,
    supportedCurrencies: string,
    kycInformation: string
}

export type IQuoteRequestData = {
    homeR2PTransactionId: string,
    amount : string,
    amountType: string,
    currency: string,
    expiration: string,
    extensionList: unknown,
    feesAmount: string,
    feesCurrency: string,
    from: unknown,
    geocode: unknown,
    initiator: string,
    initiatorType: string,
    note: string,
    quoteId: string,
    subScenario: string,
    to: Payee,
    transactionId: string,
    transactionIdType: string,
    transactionIdRequestId: string,
    converter: string,
    currencyConversion: unknown
}

export enum PayeeIdType {
    MSISDN = "MSISDN",
    IBAN = "IBAN",
    ACCOUNT_NO = "ACCOUNT_NO",
    EMAIL = "EMAIL",
    PERSONAL_ID = "PERSONAL_ID",
    BUSINESS = "BUSINESS",
    DEVICE = "DEVICE",
    ACCOUNT_ID = "ACCOUNT_ID",
    ALIAS = "ALIAS"
}

export interface IRoutes{
    //@ts-expect-error ReqRefDefaults not found
    getRoutes(): ServerRoute<ReqRefDefaults>[]
}