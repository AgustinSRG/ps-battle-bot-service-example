// Models for API body and responses

"use strict";

import { ObjectSchema } from "@asanrom/javascript-object-sanitizer";

export type ErrorResponse = {
    code: string;
    message?: string;
};

export type BattleBotBody = {
    id: string;
    log?: string[];
    decide?: boolean;
    clear?: boolean;
}[];

export const BattleBotBody_Schema = ObjectSchema.array(ObjectSchema.object({
    id: ObjectSchema.string().withDefaultValue(""),
    log: ObjectSchema.optional(ObjectSchema.array(ObjectSchema.string().withDefaultValue("")).withDefaultValue([])),
    decide: ObjectSchema.optional(ObjectSchema.boolean()),
    clear: ObjectSchema.optional(ObjectSchema.boolean()),
})).withDefaultValue([]);

export type BattleUpdateResponse = {
    id: string;
    decision?: string;
};

export type BattleBotResponse = BattleUpdateResponse[];


