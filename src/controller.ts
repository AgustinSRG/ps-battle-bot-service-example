// HTTP API controller (request handler)

"use strict";

import HTTP from "http";
import { BattleBot, encodeDecision, parsePokemonShowdownBattleEvent, simplifyBattleId, toRoomId } from "@asanrom/ps-battle-bot-lib";
import { Config } from "./config";
import { Logger } from "./log";
import { secureStringCompare } from "./utils";
import { BattleBotBody, BattleBotBody_Schema, BattleBotResponse, BattleUpdateResponse, ErrorResponse } from "./api-model";

export class ApiController {
    private config: Config;
    private battleBot: BattleBot;

    private battles: Set<string>;

    constructor(config: Config, battleBot: BattleBot) {
        this.config = config;
        this.battleBot = battleBot;
        this.battles = new Set();
    }

    // HTTP request handler
    public handle(request: HTTP.IncomingMessage, response: HTTP.ServerResponse): void {
        let url: URL;

        try {
            url = new URL(request.url, "http://localhost");
        } catch (ex) {
            Logger.getInstance().debug(ex);
            response.writeHead(400);
            response.end("BAD_REQUEST");
        }

        const path = url.pathname;
        const method = (request.method || "").toUpperCase();

        Logger.getInstance().trace(`[REQUEST] [FROM: ${request.socket.remoteAddress}] ${method} ${path}`);

        const authorization = request.headers.authorization + "";

        const isAuthorized = secureStringCompare(authorization, this.config.authToken);

        switch (method) {
            case "POST":
                if (!isAuthorized) {
                    response.writeHead(401);
                    response.end("UNAUTHORIZED");
                    return;
                }

                switch (path) {
                    case "/battle-bot":
                        this.handleBattleBotEndpoint(request, response).catch(err => {
                            Logger.getInstance().error(err);
                            response.writeHead(500);
                            response.end("Internal error. Check logs for details.");
                        });
                        break;
                    default:
                        response.writeHead(404);
                        response.end("NOT_FOUND");
                }
                break;
            default:
                response.writeHead(404);
                response.end("NOT_FOUND");
        }
    }

    private readJsonBody(request: HTTP.IncomingMessage): Promise<unknown> {
        return new Promise<unknown>(resolve => {
            let body = '';
            request.on("data", chunk => {
                body += chunk;
            });

            request.on("end", () => {
                if (!body) {
                    return resolve(null);
                }

                try {
                    resolve(JSON.parse(body));
                } catch (ex) {
                    Logger.getInstance().error(ex);
                    resolve(null);
                }
            });
        });
    }

    private sendBadRequestError(response: HTTP.ServerResponse, error: ErrorResponse) {
        response.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
        });
        response.end(JSON.stringify(error));
    }

    private async handleBattleBotEndpoint(request: HTTP.IncomingMessage, response: HTTP.ServerResponse): Promise<void> {
        const body = await this.readJsonBody(request);

        if (!body) {
            this.sendBadRequestError(response, {
                code: "BAD_BODY",
                message: "The request body is malformed. Please follow the API specification."
            });
            return;
        }

        const battleUpdateList: BattleBotBody = BattleBotBody_Schema.sanitize(body);

        const battleBotResponse: BattleBotResponse = [];

        for (const battleUpdateObject of battleUpdateList) {
            const id = simplifyBattleId(battleUpdateObject.id);

            if (!id) {
                Logger.getInstance().debug(`Ignored battle update object with empty battle ID`);
            }

            if (!this.battles.has(id)) {
                this.battleBot.initBattle(id);
                this.battles.add(id);
                Logger.getInstance().debug(`Initialized battle: ${id}`);
            }

            const battleEvents = (battleUpdateObject.log || []).map(log => parsePokemonShowdownBattleEvent(log)).filter(e => e !== null);

            for (const battleEvent of battleEvents) {
                this.battleBot.addBattleEvent(id, battleEvent);
            }

            const updateResponse: BattleUpdateResponse = {
                id,
            };

            if (battleUpdateObject.decide) {
                const battle = this.battleBot.getBattle(id);
                const decision = await this.battleBot.makeDecision(id);

                if (battle && decision) {
                    updateResponse.decision = encodeDecision(battle, decision);
                }
            }

            battleBotResponse.push(updateResponse);

            if (battleUpdateObject.clear) {
                Logger.getInstance().debug(`Cleared battle: ${id}`);
                this.battleBot.removeBattle(id);
                this.battles.delete(id);
            }
        }

        response.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
        });
        response.end(JSON.stringify(battleBotResponse));
    }
}
