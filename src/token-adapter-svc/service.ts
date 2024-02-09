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


import {IHttpClient, ITokenMappingStorageRepo} from "domain/interfaces";
import {FetchHttpClient, MemoryTokenMappingStorageRepo} from "../implementations";
import {CoreConnectorAggregate, SDKAggregate} from "../domain";
import {Server} from "@hapi/hapi";
import process from "process";
import {CoreConnectorRoutes} from "./coreConnectorRoutes";
import {SDKRoutes} from "./sdkRoutes";


const CORE_CONNECTOR_SERVER_PORT = process.env["SERVER_PORT"] || 3000;
const SDK_SERVER_PORT = process.env["SERVER_PORT"] || 3001;
const SERVER_HOST = process.env["SERVER_HOST"] || "0.0.0.0";
const CORE_CONNECTOR_URL = process.env["CORE_CONNECTOR_URL"] || "http://localhost:4040";

export class Service {
    static tokenMappingStorageRepo: ITokenMappingStorageRepo;
    static coreConnectorAggregate: CoreConnectorAggregate;
    static sdkAggregate: SDKAggregate;
    static coreConnectorServer: Server;
    static sdkServer: Server;
    static httpClient: IHttpClient;

    static async start(aliasMappingStorageRepo?: ITokenMappingStorageRepo, httpClient?: IHttpClient){
         if(!aliasMappingStorageRepo){
          aliasMappingStorageRepo = new MemoryTokenMappingStorageRepo();
          await aliasMappingStorageRepo.init();
         }
         this.tokenMappingStorageRepo = aliasMappingStorageRepo;

         if(!httpClient){
             httpClient = new FetchHttpClient();
             await httpClient?.init();
         }
         this.httpClient = httpClient;

         this.coreConnectorAggregate = new CoreConnectorAggregate(this.tokenMappingStorageRepo);
         this.sdkAggregate = new SDKAggregate(this.tokenMappingStorageRepo,this.httpClient,CORE_CONNECTOR_URL);

         await this.coreConnectorAggregate.init();
         await this.sdkAggregate.init();

         // start server
         await this.setUpAndStartServers();
    }

   static async setUpAndStartServers():Promise<void>{
       return new Promise<void>(resolve => {
           // Start Hapi Server
           this.coreConnectorServer = new Server({
               port: CORE_CONNECTOR_SERVER_PORT,
               host: SERVER_HOST
           });

           this.sdkServer = new Server({
               port: SDK_SERVER_PORT,
               host: SERVER_HOST
           });


           const coreConnectorRoutes = new CoreConnectorRoutes(this.coreConnectorAggregate);
           const sdkRoutes = new SDKRoutes(this.sdkAggregate);

           this.coreConnectorServer.route(coreConnectorRoutes.getRoutes());
           this.sdkServer.route(sdkRoutes.getRoutes());

           this.coreConnectorServer.start();
           console.log('Core Connector Server running on %s', this.coreConnectorServer.info.uri);

           this.sdkServer.start();
           console.log('SDK Server running on %s', this.sdkServer.info.uri);

           resolve();
       });
   }

   static async stop(){
        // destroy aggregate and application
        await this.coreConnectorAggregate.destroy();
        await this.sdkAggregate.destroy();
        await this.coreConnectorServer.stop({timeout:60});
        await this.sdkServer.stop({timeout:60});

   }

}

async function _handle_int_and_term_signals(signal: NodeJS.Signals): Promise<void> {
    console.info(`Service - ${signal} received - cleaning up...`);
    let clean_exit = false;
    setTimeout(() => {
        clean_exit || process.abort();
    }, 5000);

    // call graceful stop routine
    await Service.stop();

    clean_exit = true;
    process.exit();
}

//catches ctrl+c event
process.on("SIGINT", _handle_int_and_term_signals.bind(this));
//catches program termination event
process.on("SIGTERM", _handle_int_and_term_signals.bind(this));

//do something when coreConnectorServer is closing
process.on("exit", /* istanbul ignore next */async () => {
    console.log("Service - exiting...");
});
process.on("uncaughtException", /* istanbul ignore next */(err: Error) => {
    console.error(err);
    console.log("UncaughtException - EXITING...");
    process.exit(999);
});