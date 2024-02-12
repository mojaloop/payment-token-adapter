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
import axios from "axios";

describe("token-adapter-svc test suite",()=>{

     beforeAll(async ()=>{
         await Service.start();
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


     test("GET: token-adapter-svc: sdk inbound: /parties with type ALIAS. TokenRepo should be read", async ()=>{
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

         jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

         // act
         await axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`);

         //assert
         expect(Service.tokenMappingStorageRepo.getMapping).toHaveBeenCalled();
     });

     test("GET: token-adapter-svc: sdk inbound: /parties with type ALIAS that is not found. Should return Not Found", async()=>{
         // Arrange
         const ID = "CM2903E3E0QE";
         const Type = "ALIAS";

         // Act
         const res = await axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`);

         // Assert
         expect(res.data.statusCode).toEqual("3204");
     });

     test("GET: token-adapter-svc: sdk inbound: /parties with type not ALIAS. Should pass through. TokenRepo should not be called", async ()=>{
         // arrange
         jest.spyOn(Service.tokenMappingStorageRepo,"getMapping");

         const ID = "CM2903E3E0WE";
         const Type = "IBAN";

         // Act
         await axios.get(`http://0.0.0.0:3001/parties/${Type}/${ID}`);

         //Assert
         expect(Service.tokenMappingStorageRepo.getMapping).not.toHaveBeenCalled();
     });
});
