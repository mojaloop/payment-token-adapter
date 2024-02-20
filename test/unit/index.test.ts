/// <reference lib="dom" />
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


import {Service} from "../../src/token-adapter-svc";
import axios, {AxiosError} from "axios";
import {HTTPClientMock} from "../mocks/token-adapter-mocks";

const httpClient = new HTTPClientMock();

describe("token-adapter-svc test suite",()=>{

     beforeAll(async ()=>{
         await Service.start(undefined,httpClient);
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

     test("GET - token-adapter-svc: get token Mapping should return a mapping for an existent token mapping", async ()=>{
        // Arrange
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

         // Act
         const res = await axios.get(
             "http://0.0.0.0:3000/parties/ALIAS/CM2903E3E0WE"
         );

         expect(res.data).toEqual({
             paymentToken:"CM2903E3E0WE",
             payeeId:"256781666410",
             payeeIdType:"DEVICE"
         });
     });


     test("GET: token-adapter-svc: sdk inbound: /parties with type ALIAS. Axios should throw error because the return code is 500", async ()=>{
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
         await expect(axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`)).rejects.toThrow(AxiosError);
     });

     test("GET: token-adapter-svc: sdk inbound: /parties with type ALIAS that is not found. Should return Not Found", async()=>{
         // Arrange
         const ID = "CM2903E3E0QE";
         const Type = "ALIAS";

         // Act $ Assert
         await expect(axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`)).rejects.toThrow(AxiosError);
     });

     test("GET: token-adapter-svc: sdk inbound: /parties with type not ALIAS. Should pass through. TokenRepo should not be called", async ()=>{
         // arrange

         const ID = "CM2903E3E0WE";
         const Type = "IBAN";

         // Act and Assert
         await expect(axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`)).rejects.toThrow(AxiosError);
     });

     // test("POST: token-adapter-svc: sdk inbound: /quoterequests ", async ()=>{
     //    await axios.post(
     //        `http://0.0.0.0:3001/quoterequests`,
     //        {
     //            "homeR2PTransactionId": "string",
     //            "amount": "19287029",
     //            "amountType": "SEND",
     //            "currency": "AED",
     //            "expiration": "9708-02-29T07:05:45.071-07:21",
     //            "extensionList": [
     //                {
     //                    "key": "string",
     //                    "value": "string"
     //                }
     //            ],
     //            "feesAmount": "9290.12",
     //            "feesCurrency": "AED",
     //            "from": {
     //                "dateOfBirth": "8726-10-30",
     //                "displayName": "string",
     //                "extensionList": [
     //                    {
     //                        "key": "string",
     //                        "value": "string"
     //                    }
     //                ],
     //                "firstName": "string",
     //                "fspId": "string",
     //                "idSubValue": "string",
     //                "idType": "MSISDN",
     //                "idValue": "string",
     //                "lastName": "string",
     //                "merchantClassificationCode": "string",
     //                "middleName": "string",
     //                "type": "CONSUMER",
     //                "supportedCurrencies": [
     //                    "AED"
     //                ],
     //                "kycInformation": "string"
     //            },
     //            "geoCode": {
     //                "latitude": "90.0",
     //                "longitude": "14"
     //            },
     //            "initiator": "PAYER",
     //            "initiatorType": "CONSUMER",
     //            "note": "string",
     //            "quoteId": "d4e9bac6-933b-23c9-b036-a3e1212411fc",
     //            "subScenario": "string",
     //            "to": {
     //                "dateOfBirth": "9763-02-10",
     //                "displayName": "string",
     //                "extensionList": [
     //                    {
     //                        "key": "string",
     //                        "value": "string"
     //                    }
     //                ],
     //                "firstName": "string",
     //                "fspId": "string",
     //                "idSubValue": "string",
     //                "idType": "MSISDN",
     //                "idValue": "string",
     //                "lastName": "string",
     //                "merchantClassificationCode": "string",
     //                "middleName": "string",
     //                "type": "CONSUMER",
     //                "supportedCurrencies": [
     //                    "AED"
     //                ],
     //                "kycInformation": "string"
     //            },
     //            "transactionId": "24357052-5d7b-136b-9002-9d911e960d47",
     //            "transactionType": "TRANSFER",
     //            "transactionRequestId": "b4689b65-f27d-1f8d-b012-4ef3e5f5039a",
     //            "converter": "string",
     //            "currencyConversion": "string"
     //        }
     //    )
     // });
});
