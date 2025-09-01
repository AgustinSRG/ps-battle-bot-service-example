// Utils

"use strict";

import Crypto from "crypto";

/**
 * Turns a timestamp into a formatted date.
 * @param timestamp The input timestamp.
 * @returns         The formatted date.
 */
export function formatDate(timestamp: number): string {
    const d: Date = new Date(timestamp);
    let day: string = "" + d.getDate();
    let month: string = "" + (d.getMonth() + 1);
    const year: string = "" + d.getFullYear();
    let hour: string = "" + d.getHours();
    let minutes: string = "" + d.getMinutes();
    let seconds: string = "" + d.getSeconds();

    if (day.length < 2) {
        day = "0" + day;
    }

    if (month.length < 2) {
        month = "0" + month;
    }

    if (hour.length < 2) {
        hour = "0" + hour;
    }

    if (minutes.length < 2) {
        minutes = "0" + minutes;
    }

    if (seconds.length < 2) {
        seconds = "0" + seconds;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

/**
 * Gets boolean environment variable
 * @param name The variable name
 * @param defaultVal The default value
 * @returns The variable value
 */
export function getBoolEnvVar(name: string, defaultVal: boolean): boolean {
    const val = process.env[name];

    if (val === undefined) {
        return defaultVal;
    }

    const valStr = (val + "").toUpperCase();

    if (valStr === "YES" || valStr === "1" || valStr === "TRUE") {
        return true;
    } else if (valStr === "NO" || valStr === "0" || valStr === "FALSE") {
        return false;
    } else {
        return defaultVal;
    }
}

/**
 * Compares string (time-secure)
 * @param a First string
 * @param b Second string
 * @returns True if they match, false if they don't
 */
export function secureStringCompare(a: string, b: string): boolean {
    try {
        return Crypto.timingSafeEqual(new Uint8Array(Buffer.from(a, 'utf8')), new Uint8Array(Buffer.from(b, 'utf8')));
    } catch (ex) {
        return false;
    }
}
