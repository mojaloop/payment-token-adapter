// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// todo: fix all TS issues in this file (central-services-logger exports Winston interface, but implements it badly!)

import mlLogger from '@mojaloop/central-services-logger';
import stringify from 'fast-safe-stringify';
import { ILogger } from '../domain';
import { TJson } from './httpClient';

const makeLogString = (message: string, meta?: unknown) => meta
    ? `${message} - ${typeof meta === 'object' ? stringify(meta) : meta}`
    : message;

// todo: set logLevel from config
export const loggerFactory = (context: TJson = {}): ILogger => new Logger(context);

export class Logger implements ILogger {
    private readonly log = mlLogger;
    private readonly context: TJson = {};

    // todo: make context TJson | string
    constructor(context: TJson) {
        this.context = context;
    }

    error(message: string, meta?: TJson) {
        this.log.isErrorEnabled && this.log.error(this.formatLog(message, meta));
    }

    warn(message: string, meta?: TJson) {
        this.log.isWarnEnabled && this.log.warn(this.formatLog(message, meta));
    }

    trace(message: string, meta?: TJson) {
        this.log.isTraceEnabled && this.log.trace(this.formatLog(message, meta));
    }

    info(message: string, meta?: TJson) {
        this.log.isInfoEnabled && this.log.info(this.formatLog(message, meta));
    }

    verbose(message: string, meta?: TJson) {
        this.log.isVerboseEnabled && this.log.verbose(this.formatLog(message, meta));
    }

    debug(message: string, meta?: TJson) {
        this.log.isDebugEnabled && this.log.debug(this.formatLog(message, meta));
    }

    silly(message: string, meta?: TJson) {
        this.log.isLevelEnabled && this.log.silly(this.formatLog(message, meta));
    }

    // todo: make childContext TJson | string
    child(childContext: TJson) {
        return new Logger(Object.assign({}, this.context, childContext));
    }

    private formatLog(message: string, meta: TJson = {}): string {
        // todo: get requestId (using AsyncLocalStorage)
        return makeLogString(message, Object.assign({}, meta, this.context));
    }
}
