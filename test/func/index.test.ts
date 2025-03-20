// @ts-ignore

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

import {Service} from "../../src/token-adapter-svc";
import axios, {AxiosError} from "axios";

describe("token-adapter-svc test suite",()=>{

     beforeAll(async ()=>{
         await Service.start();
     });

     beforeEach(async ()=>{
         await axios.post(
             'http://0.0.0.0:3000/tokens',
             {
                 paymentToken:"CM2903E3E0WE",
                 payeeId:"256781666410",
                 payeeIdType:"DEVICE"
             },
             {
                 "headers":{
                     "Content-Type":"application/json"
                 }
             }
         );
     });

     afterAll(async ()=>{
         await Service.stop();
     });

     test("POST - token-adapter-svc: registerToken", async ()=>{
         // Arrange
         jest.spyOn(Service.tokenMappingStorageRepo,"storeMapping");

         //Act
         const res = await axios.post(
             'http://0.0.0.0:3000/tokens',
             {
                 paymentToken:"CM2903E3E0WE",
                 payeeId:"256781666410",
                 payeeIdType:"DEVICE"
             },
             {
                 "headers":{
                     "Content-Type":"application/json"
                 }
             }
         );

         //Assert
         expect(Service.tokenMappingStorageRepo.storeMapping).toHaveBeenCalled();
     });

     test("GET: token-adapter-svc: sdk : /parties with type ALIAS. Should return status code 200", async ()=>{
         // arrange
         const ID = "CM2903E3E0WE";
         const Type = "ALIAS";

         await axios.post(
             'http://0.0.0.0:3000/tokens',
             {
                 paymentToken:"CM2903E3E0WE",
                 payeeId:"256781666410",
                 payeeIdType:"DEVICE"
             },
             {
                 "headers":{
                     "Content-Type":"application/json"
                 }
             }
         );

         // act & assert
         const res = await axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`);
         expect(res.status).toEqual(200);
     });

     test("GET: token-adapter-svc: sdk: /parties with type ALIAS that is not found. Should return Not Found", async()=>{
         // Arrange
         const ID = "CM2903E3E0QE";
         const Type = "ALIAS";

         // Act $ Assert
         await expect(axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`)).rejects.toThrow(AxiosError);
     });

     test("GET: token-adapter-svc: sdk : /parties with type not ALIAS. Should pass through. TokenRepo should not be called", async ()=>{
         // arrange

         const ID = "CM2903E3E0WE";
         const Type = "IBAN";

         jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

         // Act
         await axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`);

         //Assert
         expect(Service.tokenMappingStorageRepo.getMapping).not.toHaveBeenCalled();
     });

     test("POST: token-adapter-svc: sdk: /quoterequests with type ALIAS for existent token. Token Mapping repo should be read", async ()=>{
         //arrange
         const quote =  {
             "homeR2PTransactionId": "string",
             "amount": "19287029",
             "amountType": "SEND",
             "currency": "AED",
             "expiration": "9708-02-29T07:05:45.071-07:21",
             "extensionList": [
                 {
                     "key": "string",
                     "value": "string"
                 }
             ],
             "feesAmount": "9290.12",
             "feesCurrency": "AED",
             "from": {
                 "dateOfBirth": "8726-10-30",
                 "displayName": "string",
                 "extensionList": [
                     {
                         "key": "string",
                         "value": "string"
                     }
                 ],
                 "firstName": "string",
                 "fspId": "string",
                 "idSubValue": "string",
                 "idType": "MSISDN",
                 "idValue": "string",
                 "lastName": "string",
                 "merchantClassificationCode": "string",
                 "middleName": "string",
                 "type": "CONSUMER",
                 "supportedCurrencies": [
                     "AED"
                 ],
                 "kycInformation": "string"
             },
             "geoCode": {
                 "latitude": "90.0",
                 "longitude": "14"
             },
             "initiator": "PAYER",
             "initiatorType": "CONSUMER",
             "note": "string",
             "quoteId": "d4e9bac6-933b-23c9-b036-a3e1212411fc",
             "to": {
                 "dateOfBirth": "9763-02-10",
                 "displayName": "string",
                 "extensionList": [
                     {
                         "key": "string",
                         "value": "string"
                     }
                 ],
                 "firstName": "string",
                 "fspId": "string",
                 "idSubValue": "string",
                 "idType": "ALIAS",
                 "idValue": "CM2903E3E0WE",
                 "lastName": "string",
                 "merchantClassificationCode": "string",
                 "middleName": "string",
                 "type": "CONSUMER",
                 "supportedCurrencies": [
                     "AED"
                 ],
                 "kycInformation": "string"
             },
             "transactionId": "24357052-5d7b-136b-9002-9d911e960d47",
             "transactionType": "TRANSFER",
             "transactionRequestId": "b4689b65-f27d-1f8d-b012-4ef3e5f5039a",
             "converter": "string",
             "currencyConversion": "string"
         };

         jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

         // Act
         const res = await axios.post(
             `http://0.0.0.0:3001/quoterequests`,
             JSON.stringify(quote),
             {
                 headers:{
                     "Content-Type":"application/json"
                 }
             }
         );

         console.log(res);

         //Assert
         expect(Service.tokenMappingStorageRepo.getMapping).toHaveBeenCalled();
     });

    test("POST: token-adapter-svc: sdk: /quoterequests with type ALIAS for non existent token. Should throw error", async ()=>{
        //arrange
        const quote =  {
            "homeR2PTransactionId": "string",
            "amount": "19287029",
            "amountType": "SEND",
            "currency": "AED",
            "expiration": "9708-02-29T07:05:45.071-07:21",
            "extensionList": [
                {
                    "key": "string",
                    "value": "string"
                }
            ],
            "feesAmount": "9290.12",
            "feesCurrency": "AED",
            "from": {
                "dateOfBirth": "8726-10-30",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "MSISDN",
                "idValue": "string",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "AED"
                ],
                "kycInformation": "string"
            },
            "geoCode": {
                "latitude": "90.0",
                "longitude": "14"
            },
            "initiator": "PAYER",
            "initiatorType": "CONSUMER",
            "note": "string",
            "quoteId": "d4e9bac6-933b-23c9-b036-a3e1212411fc",
            "to": {
                "dateOfBirth": "9763-02-10",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "ALIAS",
                "idValue": "CM2903EBB0WE",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "AED"
                ],
                "kycInformation": "string"
            },
            "transactionId": "24357052-5d7b-136b-9002-9d911e960d47",
            "transactionType": "TRANSFER",
            "transactionRequestId": "b4689b65-f27d-1f8d-b012-4ef3e5f5039a",
            "converter": "string",
            "currencyConversion": "string"
        };

        // Act and Assert
        await expect(axios.post(
            `http://0.0.0.0:3001/quoterequests`,
            JSON.stringify(quote),
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        )).rejects.toThrow();
    });

    test("POST: token-adapter-svc: sdk: /quoterequests with type not ALIAS. Token Mapping repo should not be read", async ()=>{
        //arrange
        const quote =  {
            "homeR2PTransactionId": "string",
            "amount": "19287029",
            "amountType": "SEND",
            "currency": "AED",
            "expiration": "9708-02-29T07:05:45.071-07:21",
            "extensionList": [
                {
                    "key": "string",
                    "value": "string"
                }
            ],
            "feesAmount": "9290.12",
            "feesCurrency": "AED",
            "from": {
                "dateOfBirth": "8726-10-30",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "MSISDN",
                "idValue": "string",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "AED"
                ],
                "kycInformation": "string"
            },
            "geoCode": {
                "latitude": "90.0",
                "longitude": "14"
            },
            "initiator": "PAYER",
            "initiatorType": "CONSUMER",
            "note": "string",
            "quoteId": "d4e9bac6-933b-23c9-b036-a3e1212411fc",
            "to": {
                "dateOfBirth": "9763-02-10",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "DEVICE",
                "idValue": "SN2903EBB0WE",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "AED"
                ],
                "kycInformation": "string"
            },
            "transactionId": "24357052-5d7b-136b-9002-9d911e960d47",
            "transactionType": "TRANSFER",
            "transactionRequestId": "b4689b65-f27d-1f8d-b012-4ef3e5f5039a",
            "converter": "string",
            "currencyConversion": "string"
        };

        jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

        // Act
        await axios.post(
            `http://0.0.0.0:3001/quoterequests`,
            JSON.stringify(quote),
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );

        //Assert
        expect(Service.tokenMappingStorageRepo.getMapping).not.toHaveBeenCalled();
    });

    test("POST: token-adapter-svc: sdk: /transfers with type ALIAS with existent token: Token mapping repo should be read", async ()=>{
        // arrange
        const transfer = {
            "homeR2PTransactionId": "string",
            "amount": "0.347",
            "amountType": "SEND",
            "currency": "AED",
            "from": {
                "dateOfBirth": "8477-05-21",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "ACCOUNT_NO",
                "idValue": "string",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "AGENT",
                "supportedCurrencies": [
                    "string"
                ],
                "kycInformation": "string"
            },
            "ilpPacket": {
                "data": {
                    "amount": {
                        "amount": "4000.2",
                        "currency": "AED"
                    },
                    "payee": {
                        "partyIdInfo": {
                            "partyIdType": "ACCOUNT_ID",
                            "partyIdentifier": "38928237283423"
                        }
                    },
                    "payer": {
                        "partyIdInfo": {
                            "partyIdType": "EMAIL",
                            "partyIdentifier": "ei@gmail.com"
                        }
                    },
                    "quoteId": "00ace33f-1fea-4ccd-9479-7ef6e7e37c90",
                    "transactionId": "3b2d2778-9b3c-4f18-90f6-62b054625652",
                    "transactionType": {
                        "initiator": "PAYER",
                        "initiatorType": "DEVICE",
                        "scenario": "TRANSFER",
                        "subScenario": "MY_STRING_CONSTANT"
                    }
                }
            },
            "note": "string",
            "quote": {
                "expiration": "3945-08-30T22:03:24.190Z",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "geoCode": {
                    "latitude": "34.2",
                    "longitude": "0.3432"
                },
                "payeeFspCommissionAmount": "72",
                "payeeFspCommissionAmountCurrency": "AED",
                "payeeFspFeeAmount": "0",
                "payeeFspFeeAmountCurrency": "AED",
                "payeeReceiveAmount": "0",
                "payeeReceiveAmountCurrency": "AED",
                "quoteId": "71cee55f-c58a-2a8e-8289-e18a2c80bf48",
                "transactionId": "2861d780-60f5-5127-a73b-ab0617c00f72",
                "transferAmount": "0.9",
                "transferAmountCurrency": "AED"
            },
            "quoteRequestExtensions": [
                {
                    "key": "string",
                    "value": "string"
                }
            ],
            "subScenario": "MY_STRING",
            "to": {
                "dateOfBirth": "8477-05-21",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "ALIAS",
                "idValue": "CM2903E3E0WE",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "string"
                ],
                "kycInformation": "string"
            },
            "transactionType": "TRANSFER",
            "transferId": "3b2d2778-9b3c-4f18-90f6-62b054625652",
            "transactionRequestId": "3b2d2778-9b3c-4f18-90f6-62b054625652"
        }

        jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

        //act
        await axios.post(
            `http://0.0.0.0:3001/transfers`,
            JSON.stringify(transfer),
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );

        // assert
        expect(Service.tokenMappingStorageRepo.getMapping).toHaveBeenCalled();
    });

    test("POST: token-adapter-svc: sdk: /transfers with type ALIAS with non existent token: Should fail with 404", async ()=>{
        // arrange
        const transfer = {
            "homeR2PTransactionId": "string",
            "amount": "0.347",
            "amountType": "SEND",
            "currency": "AED",
            "from": {
                "dateOfBirth": "8477-05-21",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "ACCOUNT_NO",
                "idValue": "string",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "AGENT",
                "supportedCurrencies": [
                    "string"
                ],
                "kycInformation": "string"
            },
            "ilpPacket": {
                "data": {
                    "amount": {
                        "amount": "4000.2",
                        "currency": "AED"
                    },
                    "payee": {
                        "partyIdInfo": {
                            "partyIdType": "ACCOUNT_ID",
                            "partyIdentifier": "38928237283423"
                        }
                    },
                    "payer": {
                        "partyIdInfo": {
                            "partyIdType": "EMAIL",
                            "partyIdentifier": "ei@gmail.com"
                        }
                    },
                    "quoteId": "00ace33f-1fea-4ccd-9479-7ef6e7e37c90",
                    "transactionId": "3b2d2778-9b3c-4f18-90f6-62b054625652",
                    "transactionType": {
                        "initiator": "PAYER",
                        "initiatorType": "DEVICE",
                        "scenario": "TRANSFER",
                        "subScenario": "MY_STRING_CONSTANT"
                    }
                }
            },
            "note": "string",
            "quote": {
                "expiration": "3945-08-30T22:03:24.190Z",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "geoCode": {
                    "latitude": "34.2",
                    "longitude": "0.3432"
                },
                "payeeFspCommissionAmount": "72",
                "payeeFspCommissionAmountCurrency": "AED",
                "payeeFspFeeAmount": "0",
                "payeeFspFeeAmountCurrency": "AED",
                "payeeReceiveAmount": "0",
                "payeeReceiveAmountCurrency": "AED",
                "quoteId": "71cee55f-c58a-2a8e-8289-e18a2c80bf48",
                "transactionId": "2861d780-60f5-5127-a73b-ab0617c00f72",
                "transferAmount": "0.9",
                "transferAmountCurrency": "AED"
            },
            "quoteRequestExtensions": [
                {
                    "key": "string",
                    "value": "string"
                }
            ],
            "subScenario": "MY_STRING",
            "to": {
                "dateOfBirth": "8477-05-21",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "ALIAS",
                "idValue": "CM2903E3EYYE",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "string"
                ],
                "kycInformation": "string"
            },
            "transactionType": "TRANSFER",
            "transferId": "3b2d2778-9b3c-4f18-90f6-62b054625652",
            "transactionRequestId": "3b2d2778-9b3c-4f18-90f6-62b054625652"
        }

        // Act and Assert
        await expect(axios.post(
            `http://0.0.0.0:3001/transfers`,
            JSON.stringify(transfer),
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        )).rejects.toThrow();
    });

    test("POST: token-adapter-svc: sdk: /transfers with type not ALIAS : Token mapping repo should not be read", async ()=>{
        // arrange
        const transfer = {
            "homeR2PTransactionId": "string",
            "amount": "0.347",
            "amountType": "SEND",
            "currency": "AED",
            "from": {
                "dateOfBirth": "8477-05-21",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "ACCOUNT_NO",
                "idValue": "string",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "AGENT",
                "supportedCurrencies": [
                    "string"
                ],
                "kycInformation": "string"
            },
            "ilpPacket": {
                "data": {
                    "amount": {
                        "amount": "4000.2",
                        "currency": "AED"
                    },
                    "payee": {
                        "partyIdInfo": {
                            "partyIdType": "ACCOUNT_ID",
                            "partyIdentifier": "38928237283423"
                        }
                    },
                    "payer": {
                        "partyIdInfo": {
                            "partyIdType": "EMAIL",
                            "partyIdentifier": "ei@gmail.com"
                        }
                    },
                    "quoteId": "00ace33f-1fea-4ccd-9479-7ef6e7e37c90",
                    "transactionId": "3b2d2778-9b3c-4f18-90f6-62b054625652",
                    "transactionType": {
                        "initiator": "PAYER",
                        "initiatorType": "DEVICE",
                        "scenario": "TRANSFER",
                        "subScenario": "MY_STRING_CONSTANT"
                    }
                }
            },
            "note": "string",
            "quote": {
                "expiration": "3945-08-30T22:03:24.190Z",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "geoCode": {
                    "latitude": "34.2",
                    "longitude": "0.3432"
                },
                "payeeFspCommissionAmount": "72",
                "payeeFspCommissionAmountCurrency": "AED",
                "payeeFspFeeAmount": "0",
                "payeeFspFeeAmountCurrency": "AED",
                "payeeReceiveAmount": "0",
                "payeeReceiveAmountCurrency": "AED",
                "quoteId": "71cee55f-c58a-2a8e-8289-e18a2c80bf48",
                "transactionId": "2861d780-60f5-5127-a73b-ab0617c00f72",
                "transferAmount": "0.9",
                "transferAmountCurrency": "AED"
            },
            "quoteRequestExtensions": [
                {
                    "key": "string",
                    "value": "string"
                }
            ],
            "subScenario": "MY_STRING",
            "to": {
                "dateOfBirth": "8477-05-21",
                "displayName": "string",
                "extensionList": [
                    {
                        "key": "string",
                        "value": "string"
                    }
                ],
                "firstName": "string",
                "fspId": "string",
                "idSubValue": "string",
                "idType": "MSISDN",
                "idValue": "25478234232",
                "lastName": "string",
                "merchantClassificationCode": "string",
                "middleName": "string",
                "type": "CONSUMER",
                "supportedCurrencies": [
                    "string"
                ],
                "kycInformation": "string"
            },
            "transactionType": "TRANSFER",
            "transferId": "3b2d2778-9b3c-4f18-90f6-62b054625652",
            "transactionRequestId": "3b2d2778-9b3c-4f18-90f6-62b054625652"
        }

        jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

        //act
        await axios.post(
            `http://0.0.0.0:3001/transfers`,
            JSON.stringify(transfer),
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );

        // assert
        expect(Service.tokenMappingStorageRepo.getMapping).not.toHaveBeenCalled();
    });

});
