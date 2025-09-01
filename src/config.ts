// Configuration

"use strict";

import { getBoolEnvVar } from "./utils";

export interface HttpOptions {
    enabled: boolean;
    port: number;
    bindAddress: string;
}

export interface HttpsOptions extends HttpOptions {
    certificatePath: string;
    keyPath: string;
}

export interface Config {
    http: HttpOptions;
    https: HttpsOptions;
    authToken: string;
}

export function loadConfiguration(): Config {
    return {
        http: {
            enabled: getBoolEnvVar("HTTP_ENABLED", true),
            port: parseInt(process.env.HTTP_PORT || "8080", 10) || 8080,
            bindAddress: process.env.HTTP_BIND_ADDRESS || "",
        },
        https: {
            enabled: getBoolEnvVar("HTTPS_ENABLED", false),
            port: parseInt(process.env.HTTPS_PORT || "8443", 10) || 8443,
            bindAddress: process.env.HTTPS_BIND_ADDRESS || "",
            certificatePath: process.env.HTTPS_CERTIFICATE_PATH || "",
            keyPath: process.env.HTTPS_KEY_PATH || "",
        },
        authToken: process.env.API_AUTH_TOKEN || "",
    };
}
