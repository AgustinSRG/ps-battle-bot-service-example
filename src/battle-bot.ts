// Battle bot

"use strict";

import { BattleBot, DefaultBattleAnalyzerFactory, GenericNPCDecisionAlgorithm, toId, TopDamageDecisionAlgorithm } from "@asanrom/ps-battle-bot-lib";

// Instantiate decision algorithms we want to use
const exampleDefaultAlgorithm = new GenericNPCDecisionAlgorithm();
const exampleTopDamageAlgorithm = new TopDamageDecisionAlgorithm();

// This function creates the battle bot
// Change the algorithms if you fork this example
export function makeBattleBot(): BattleBot {
    return new BattleBot(battleDetails => {
        if (toId(battleDetails.format).includes("challengecup1v1") || toId(battleDetails.format).includes("challengecup2v2")) {
            // For 1v1 and 2v2 random, the best algorithm is just using the most damaging move
            return {
                algorithm: exampleTopDamageAlgorithm,
                analyzerFactory: DefaultBattleAnalyzerFactory,
            };
        }

        // Default
        return {
            algorithm: exampleDefaultAlgorithm,
            analyzerFactory: DefaultBattleAnalyzerFactory,
        };
    }, {
        autoDecisionMaking: false,
    });
}
