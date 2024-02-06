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


import {ITokenMappingStorageRepo} from "interfaces";
import {MemoryTokenMappingStorageRepo} from "../implementations";
import {Aggregate} from "../domain";
import {Server} from "@hapi/hapi";
import process from "process";
import {TokenAdapterRoutes} from "./routes";


const SERVER_PORT = process.env["SERVER_PORT"] || 3000;
const SERVER_HOST = process.env["SERVER_HOST"] || "0.0.0.0";

export class Service {
    static tokenMappingStorageRepo: ITokenMappingStorageRepo;
    static tokenAdapterAggregate: Aggregate;
    static app: Server;

    static async start(aliasMappingStorageRepo?: ITokenMappingStorageRepo){
         if(!aliasMappingStorageRepo){
          aliasMappingStorageRepo = new MemoryTokenMappingStorageRepo();
          await aliasMappingStorageRepo.init();
         }
         this.tokenMappingStorageRepo = aliasMappingStorageRepo;

         this.tokenAdapterAggregate = new Aggregate(this.tokenMappingStorageRepo);
         // start server
         await this.setUpAndStartHapiServer();
    }

   static async setUpAndStartHapiServer():Promise<void>{
       return new Promise<void>(resolve => {
           // Start Hapi Server
           this.app = new Server({
               port: SERVER_PORT,
               host: SERVER_HOST
           });

           const tokenAdapterRoutes = new TokenAdapterRoutes(this.tokenAdapterAggregate);

           this.app.route(tokenAdapterRoutes.getRoutes());

           this.app.start();
           console.log('Server running on %s', this.app.info.uri);

           resolve();
       });
   }

   static async stop(){
        await this.tokenMappingStorageRepo.destroy();
        await this.tokenAdapterAggregate.destroy();
        await this.app.stop({timeout:60});

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

//do something when app is closing
process.on("exit", /* istanbul ignore next */async () => {
    console.log("Service - exiting...");
});
process.on("uncaughtException", /* istanbul ignore next */(err: Error) => {
    console.error(err);
    console.log("UncaughtException - EXITING...");
    process.exit(999);
});