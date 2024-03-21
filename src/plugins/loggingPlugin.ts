import { Plugin, Request, ResponseToolkit } from '@hapi/hapi';
import { ILogger } from '../domain';
import { ReqAppState } from './types';

type PluginOptions = {
  logger: ILogger;
}

export const loggingPlugin: Plugin<PluginOptions> = {
    name: 'loggingPlugin',
    version: '1.0.0',
    once: true,
    register: async (server, options) => {
        const { logger } = options;

        server.ext({
            type: 'onPreHandler',
            method: (req: Request, h: ResponseToolkit) => {
                const { path, method, info} = req;
                const { id, remoteAddress, received} = info;
                const context = {
                    id, remoteAddress, path, method, received,
                };
                Object.assign(req.app, { context });
                logger.info(`[--> req] ${method.toUpperCase()} ${path}`, context);

                return h.continue;
            },
        });

        server.ext({
            type: 'onPreResponse',
            method: (req: Request, h: ResponseToolkit) => {
                const { context } = req.app as ReqAppState; // todo: think, how to specify req.app type
                const { path, method, response } = req;
                const responseTimeSec = ((Date.now() - context.received) / 1000).toFixed(3);

                const statusCode = response instanceof Error
                    ? response.output.statusCode
                    : response.statusCode;
                logger.info(`[<-- ${statusCode}][${responseTimeSec} s] ${method.toUpperCase()} ${path}`, context);

                return h.continue;
            },
        });
    },
};
