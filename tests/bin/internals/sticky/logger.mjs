import { formatSticky } from './formatter.mjs';
import { printSticky } from './printer.mjs';
export function logSticky(...args) {
    // Nothing to do
    if (args.length === 0)
        return;
    // Split args into first and everything else
    const [first, ...rest] = args;
    // If we only have one arg, just print
    if (rest.length === 0)
        return printSticky(first);
    // If the first arg is a string containing format specifiers, we need to format it
    if (typeof first === 'string' &&
        first.includes('%c') &&
        rest.every((arg) => typeof arg === 'object')) {
        return printSticky(...formatSticky(first, ...rest));
    }
    else {
        return printSticky(...args);
    }
}
