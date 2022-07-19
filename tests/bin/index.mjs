import { attachFnToConsole, attachFnToConsoleSync, } from './internals/util/console.mjs';
import { logSticky } from './internals/sticky/logger.mjs';
import { getStickyPrinters, removeStickyPrinter, } from './internals/sticky/glue.mjs';
import { BasePreset } from './presets.mjs';
const stickyPrinterKeys = [];
export function attachConsoleSticky(override = false) {
    return attachFnToConsole(logSticky, 'sticky', override);
}
export function attachConsoleStickySync(override = false) {
    return attachFnToConsoleSync(logSticky, 'sticky', override);
}
export function detachConsoleSticky() {
    if (typeof globalThis.console.sticky !== typeof logSticky)
        return false;
    globalThis.console.sticky = undefined;
    return true;
}
export function addStyledConsoleSticky(message, ...rest) {
    if (!message.includes('%c'))
        message = `${'%c'}${message}`;
    if (rest.every((arg) => arg instanceof BasePreset)) {
        const stickyKey = logSticky(message, ...rest.map((preset) => preset.styles));
        if (stickyKey)
            stickyPrinterKeys.push(stickyKey);
        return stickyKey;
    }
    const stickyKey = logSticky(message, ...rest);
    if (stickyKey)
        stickyPrinterKeys.push(stickyKey);
    return stickyKey;
}
export function removeConsoleSticky(key) {
    return removeStickyPrinter(key);
}
export function getAllConsoleStickies() {
    return getStickyPrinters();
}
export function removeAllConsoleStickies() {
    return stickyPrinterKeys
        .map((key) => removeStickyPrinter(key))
        .every((successful) => successful);
}
export { logSticky as addConsoleSticky };
export { AttachmentError, AttachmentErrorReason, } from './internals/types/attachment-error.mjs';
export { StickyPreset } from './presets.mjs';
