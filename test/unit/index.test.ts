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

import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
// @ts-ignore
import {Service} from "../../src/token-adapter-svc";


describe("token-adapter-svc test suite",()=>{

     beforeAll(async ()=>{
         await Service.start();
     });

     afterAll(async ()=>{
         await Service.stop();
     });

     test("POST - token-adapter-svc: registerToken", async ()=>{
         const reqInit: RequestInit = {
             method: "POST",
             body: JSON.stringify({
                 paymentToken:"CM2903E3E0WE",
                 payeeId:"256781666410",
                 payeeIdType:"DEVICE"
             })
         }

         let res = await fetch('http://0.0.0.0:3000/tokens',reqInit);
     });

     test("GET - token-adapter-svc: get token Mapping should return a mapping for an existent token mapping", async ()=>{
        // Arrange
         const reqInit: RequestInit = {
             method: "POST",
             body: JSON.stringify({
                 paymentToken:"CM2903E3E0WE",
                 payeeId:"256781666410",
                 payeeIdType:"DEVICE"
             })
         }

         let res = await fetch('http://0.0.0.0:3000/tokens',reqInit);

         // Act
         const getReqInit: RequestInit = {
             method:"GET"
         }

         res = await fetch("http://0.0.0.0:3000/parties/ALIAS/CM2903E3E0WE",getReqInit);

         const data = await res.json();

         expect(data).toEqual({
             paymentToken:"CM2903E3E0WE",
             payeeId:"256781666410",
             payeeIdType:"ALIAS"
         });


     });
});
