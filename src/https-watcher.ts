// HTTPS watcher

"use strict";

import { AsyncInterval } from "@asanrom/async-tools";
import { readFileSync, stat, statSync } from "fs";
import HTTPS from "https";
import { HttpsOptions } from "./config";
import { Logger } from "./log";

// Interval wo watch for changes
const WATCH_INTERVAL_MS = 10 * 1000;

/**
 * Certificates watcher
 */
export class CertificatesWatcher {
    private server: HTTPS.Server;
    private config: HttpsOptions;

    private lastModifiedDate: number;

    private interval: AsyncInterval;

    constructor(server: HTTPS.Server, config: HttpsOptions) {
        this.server = server;
        this.config = config;
        this.interval = new AsyncInterval(this.check.bind(this), WATCH_INTERVAL_MS);
    }

    public start() {
        // Get the last modified date

        try {
            const certStats = statSync(this.config.certificatePath);
            this.lastModifiedDate = (new Date(certStats.mtime)).getTime();
        } catch (ex) {
            Logger.getInstance().error(ex);
            this.lastModifiedDate = 0;
        }

        try {
            const keyStats = statSync(this.config.keyPath);
            this.lastModifiedDate = Math.max(this.lastModifiedDate, (new Date(keyStats.mtime)).getTime());
        } catch (ex) {
            Logger.getInstance().error(ex);
        }

        this.interval.start();
    }

    private async getCertificateLastModifiedTime(): Promise<number> {
        return new Promise<number>((resolve) => {
            stat(this.config.certificatePath, (err, stats) => {
                if (err) {
                    return resolve(0);
                }

                try {
                    resolve((new Date(stats.mtime)).getTime());
                } catch (ex) {
                    Logger.getInstance().debug(ex);
                    return resolve(0);
                }
            });
        });
    }

    private async getKeyLastModifiedTime(): Promise<number> {
        return new Promise<number>((resolve) => {
            stat(this.config.keyPath, (err, stats) => {
                if (err) {
                    return resolve(0);
                }

                try {
                    resolve((new Date(stats.mtime)).getTime());
                } catch (ex) {
                    Logger.getInstance().debug(ex);
                    return resolve(0);
                }
            });
        });
    }

    /**
     * Checks for changes
     */
    private async check() {
        const certLastTime = await this.getCertificateLastModifiedTime();
        const keyLastTime = await this.getKeyLastModifiedTime();

        const latestTime = Math.max(certLastTime, keyLastTime);

        if (this.lastModifiedDate < latestTime) {
            // Changes detected

            Logger.getInstance().info("Changes in SSL certificates detected.");

            this.lastModifiedDate = latestTime;

            // Reload

            this.server.setSecureContext({
                key: readFileSync(this.config.keyPath),
                cert: readFileSync(this.config.certificatePath),
            });
        }
    }
}
