import { AttachmentError, AttachmentErrorReason, } from '../types/attachment-error.mjs';
/**
 * Stores a mapping of loggers and their interceptors
 */
const passthrus = new Map();
/**
 * Global Console logging functions
 */
export var Logger;
(function (Logger) {
    Logger["Assert"] = "assert";
    Logger["Clear"] = "clear";
    Logger["Count"] = "count";
    Logger["CountReset"] = "countReset";
    Logger["Debug"] = "debug";
    Logger["Dir"] = "dir";
    Logger["Dirxml"] = "dirxml";
    Logger["Error"] = "error";
    Logger["Group"] = "group";
    Logger["GroupCollapsed"] = "groupCollapsed";
    Logger["GroupEnd"] = "groupEnd";
    Logger["Info"] = "info";
    Logger["Log"] = "log";
    Logger["Table"] = "table";
    Logger["Time"] = "time";
    Logger["TimeEnd"] = "timeEnd";
    Logger["TimeLog"] = "timeLog";
    Logger["TimeStamp"] = "timeStamp";
    Logger["Trace"] = "trace";
    Logger["Warn"] = "warn";
})(Logger || (Logger = {}));
/**
 * Check if the given logger exists on the global console
 *
 * @param logger
 * @returns {boolean}
 */
export function consoleLoggerExists(logger) {
    if (typeof globalThis.console !== 'object')
        return false;
    return typeof globalThis.console[logger] === 'function';
}
/**
 * Attempts to produce or validate a name for the given function.
 * If passing an anonymous function, a name needs to be explicitly provided.
 *
 * @param fn The "name" property of this function will be read and validated
 * @param name When passed, the "name" property of the function is ignored in favor of this name. Must not be empty
 * @param constraints FunctionNameConstraints options object (e.g. { allowAnonymous: boolean })
 *
 * @throws {Error} Throws if the function's default name (or proposed name, if provided) is not usable
 * @returns {string} The validated function name
 */
function tryGetNameForFn(fn, name, constraints) {
    if (typeof name === 'string') {
        // A proposed name was provided, we should ignore the function's default name
        // If the proposed name is empty, we can't use it
        if (!name)
            throw new Error('If a name is provided, it must not be empty');
        return name;
    }
    else {
        // We must read the name from the function itself as one was not explicitly provided
        // If the function name is empty, we can't use it
        if (!fn.name)
            throw new Error('Name is required for anonymous functions with no name');
        // If the function was created using Function() and the allowAnonymous flag is not set, we must throw
        if (fn.name === 'anonymous' && !constraints?.allowAnonymous)
            throw new Error('Name is required for anonymous functions');
        return fn.name;
    }
}
export function consoleHasProperty(name) {
    return name in globalThis.console;
}
/**
 * Attaches the provided function to the global console object
 *
 * @param fn Function to attach
 * @param name If provided, will be used instead of fn.name
 * @param override Whether to override existing console property if it exists (defaults to not overriding)
 *
 * @returns {Promise<boolean>} Resolves to true if successful, rejects if not
 */
export async function attachFnToConsole(fn, name, override = false) {
    const consolePropertyName = tryGetNameForFn(fn, name);
    if (consoleHasProperty(consolePropertyName) && !override)
        throw new AttachmentError('Function already exists on console', AttachmentErrorReason.AlreadyExists);
    globalThis.console[consolePropertyName] = fn;
    return true;
}
/**
 * Attaches the provided function to the global console object synchronously.
 * It is strongly recommended to provide an explicit name, as some code transformation tools
 * like bundlers and minifiers may change the name of the function, leading to unexcepted results.
 *
 * @param fn Function to attach
 * @param name Strong recommended. If provided, will be used instead of fn.name
 * @param override Whether to override existing console property if it exists (defaults to not overriding)
 *
 * @returns {boolean} True if successful, false if not
 */
export function attachFnToConsoleSync(fn, name, override = false) {
    try {
        const consolePropertyName = tryGetNameForFn(fn, name);
        if (consoleHasProperty(consolePropertyName) && !override)
            return false;
        globalThis.console[consolePropertyName] = fn;
    }
    catch (e) {
        console.error(e);
        return false;
    }
    return true;
}
/**
 * Replaces the given logger on the global console with a new one that will
 * intercept the call or property read, pass the arguments to the provided onLog
 * handler, before passing along the return value from the original logger
 *
 * @param logger Name of the logger to intercept
 * @param onLog Function that will be passed the args that the logger is called with
 *
 * @returns {symbol} Key of the console property being used to store the original logger
 */
export function makeConsolePassthru(logger, onLog) {
    const key = Symbol();
    const destination = globalThis.console[logger];
    globalThis.console[key] = destination;
    passthrus.set(key, logger);
    if (typeof destination === 'function') {
        globalThis.console[logger] = (...args) => {
            onLog(...args);
            return destination(...args);
        };
    }
    else {
        const dynamic = {
            get passthruProp() {
                onLog();
                return globalThis.console[key];
            },
        };
        globalThis.console[logger] = dynamic.passthruProp;
    }
    return key;
}
/**
 * Replaces the intercepting function for the given logger with the original
 *
 * @param key Key of the console property being used to store the original logger
 *
 * @returns {boolean} Whether the removal was successful
 */
export function removeConsolePassthru(key) {
    const original = passthrus.get(key);
    passthrus.delete(key);
    if (!(original && consoleHasProperty(key)))
        return false;
    globalThis.console[original] = globalThis.console[key];
    globalThis.console[key] = undefined;
    return true;
}
/**
 * Replaces all intercepted loggers (or just the specified ones if provided) with the originals
 *
 * @param keys Keys of the console properties being used to store the original loggers
 *
 * @returns {boolean} Whether all removals were successful
 */
export function removeConsolePassthrus(keys) {
    const detachOperations = [];
    const passthruKeys = keys ?? [...passthrus.keys()];
    passthruKeys.forEach((key) => detachOperations.push(removeConsolePassthru(key)));
    return detachOperations.every((successful) => successful);
}
