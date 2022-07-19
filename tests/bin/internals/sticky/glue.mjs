import { Logger, makeConsolePassthru, removeConsolePassthrus, } from '../util/console.mjs';
const DEFAULT_MAX_ACCUMULATED_CALLS = 2;
let maxAccumulatedCalls = DEFAULT_MAX_ACCUMULATED_CALLS;
const DEFAULT_INTERVAL_DURATION = 10;
let intervalDuration = DEFAULT_INTERVAL_DURATION;
let accumulatedCalls = 0;
let listenersAttached = false;
let interval;
const passthrus = new Map();
const stickyPrinters = new Map();
function runPrinters() {
    stickyPrinters.forEach((printStickyNotice) => printStickyNotice());
    accumulatedCalls = 0;
}
function onConsoleLoggerCalled() {
    if (++accumulatedCalls > maxAccumulatedCalls) {
        runPrinters();
    }
}
export function getKeyForLogger(logger) {
    let loggerKey;
    for (const [key, loggerName] of passthrus) {
        if (logger === loggerName) {
            loggerKey = key;
        }
    }
    return loggerKey;
}
/**
 * Begins intercepting console logging calls and sets up the intervals
 *
 * @returns The key used to store the original log() function
 */
export function attachConsoleListenerPassthrus() {
    if (listenersAttached)
        return getKeyForLogger(Logger.Log);
    let logKey;
    for (const logger in console) {
        const key = makeConsolePassthru(logger, onConsoleLoggerCalled);
        if (Logger.Log === logger)
            logKey = key;
        passthrus.set(key, logger);
    }
    // We add an interval as well in case of console entries produced by native code
    interval = setInterval(runPrinters, intervalDuration * 1000);
    listenersAttached = true;
    return logKey;
}
export function detachConsoleListenerPassthrus() {
    clearInterval(interval);
    return removeConsolePassthrus([...passthrus.keys()]);
}
export function addStickyPrinter(fn) {
    const key = Symbol();
    stickyPrinters.set(key, fn);
    return key;
}
export function getStickyPrinters() {
    return stickyPrinters;
}
export function removeStickyPrinter(key) {
    const removalSucceeded = stickyPrinters.delete(key);
    if (stickyPrinters.size === 0)
        clearInterval(interval);
    return removalSucceeded;
}
