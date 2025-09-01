// Log

"use strict";

import { formatDate, getBoolEnvVar } from "./utils";

interface LoggerConfig {
    error: boolean;
    warning: boolean;
    info: boolean;
    debug: boolean;
    trace: boolean;
}

export class Logger {
    private static instance: Logger | null = null;

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger({
                error: getBoolEnvVar("LOG_ERROR", true),
                warning: getBoolEnvVar("LOG_WARNING", true),
                info: getBoolEnvVar("LOG_INFO", true),
                debug: getBoolEnvVar("LOG_DEBUG", true),
                trace: getBoolEnvVar("LOG_TRACE", true),
            });
        }

        return Logger.instance;
    }

    private config: LoggerConfig;

    constructor(config: LoggerConfig) {
        this.config = config;
    }

    public log(level: string, msg: string) {
        console.log(`[${formatDate(Date.now())}] [${level}] ${msg}`);
    }

    public error(msg: string | Error) {
        if (!this.config.error) {
            return;
        }

        if (typeof msg === "string") {
            this.log("ERROR", msg);
        } else {
            this.log("ERROR", `${msg.message}\n${msg.stack}`);
        }
    }

    public warning(msg: string) {
        if (!this.config.warning) {
            return;
        }

        this.log("WARNING", msg);
    }

    public info(msg: string) {
        if (!this.config.info) {
            return;
        }

        this.log("INFO", msg);
    }

    public debug(msg: string | Error) {
        if (!this.config.debug) {
            return;
        }

        if (typeof msg === "string") {
            this.log("DEBUG", msg);
        } else {
            this.log("DEBUG", `${msg.message}\n${msg.stack}`);
        }
    }

    public trace(msg: string) {
        if (!this.config.trace) {
            return;
        }

        this.log("TRACE", msg);
    }
}
