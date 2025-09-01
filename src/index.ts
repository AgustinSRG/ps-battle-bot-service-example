// Entry point


import DotEnv from "dotenv";
import HTTP from "http";
import HTTPS from "https";
import { loadConfiguration } from "./config";
import { makeBattleBot } from "./battle-bot";
import { ApiController } from "./controller";
import { Logger } from "./log";
import { readFileSync } from "fs";
import { CertificatesWatcher } from "./https-watcher";
import { CrashGuard } from "./crash-guard";

function main() {
    DotEnv.config(); // Load env variables

    const config = loadConfiguration();

    const battleBot = makeBattleBot();

    const controller = new ApiController(config, battleBot);

    if (config.http.enabled) {
        const httpServer = HTTP.createServer(controller.handle.bind(controller));
        httpServer.on("error", err => {
            Logger.getInstance().error(err);
        });
        httpServer.listen(config.http.port, config.http.bindAddress, () => {
            Logger.getInstance().info(`[HTTP] Listening on http://${config.http.bindAddress || 'localhost'}:${config.http.port}`);
        });
    }

    if (config.https.enabled) {
        const httpsServer = HTTPS.createServer({
            cert: readFileSync(config.https.certificatePath),
            key: readFileSync(config.https.keyPath),
        }, controller.handle.bind(controller));
        httpsServer.on("error", err => {
            Logger.getInstance().error(err);
        });
        httpsServer.listen(config.https.port, config.https.bindAddress, () => {
            Logger.getInstance().info(`[HTTPS] Listening on https://${config.https.bindAddress || 'localhost'}:${config.https.port}`);

            // Create certificate watcher
            const certWatcher = new CertificatesWatcher(httpsServer, config.https);
            certWatcher.start();
        });
    }
    
    CrashGuard.enable();
}

main();
