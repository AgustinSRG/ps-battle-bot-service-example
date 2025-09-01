// Crash guard

"use strict";

import { Logger } from "./log";

/**
 * Logs an application error.
 * @param error The uncaught exception.
 */
function logCrash(error: Error) {
    Logger.getInstance().error("[UNCAUGHT EXCEPTION] " + error.name + ": " + error.message + "\n" + error.stack);
}

/**
 * Prevents the application from crashing.
 * Logs the uncaught exceptions.
 */
export class CrashGuard {
    /**
     * Enables the crash guard.
     */
    public static enable() {
        process.on("uncaughtException", logCrash);
    }

    /**
     * Disables the crash guard.
     */
    public static disable() {
        process.removeListener("uncaughtException", logCrash);
    }
}
