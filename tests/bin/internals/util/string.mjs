import { inAnyRange, inRange } from './number.mjs';
// Latin capital/uppcase letters
export const UTF16_ALPHA_UPPER_RANGE = Object.freeze([65, 90]);
// Latin small/lowercase letters
export const UTF16_ALPHA_LOWER_RANGE = Object.freeze([97, 122]);
// Arabic/decimal Numbers
export const UTF16_NUM_RANGE = Object.freeze([48, 57]);
// Hyphen/minus character
export const UTF16_DASH_CHARCODE = 45;
export function isCommonAlphaChar(char) {
    return inAnyRange(char.charCodeAt(0), [
        UTF16_ALPHA_UPPER_RANGE,
        UTF16_ALPHA_LOWER_RANGE,
        UTF16_NUM_RANGE,
    ]);
}
export function convertCamelCaseToKebabCase(camelCased) {
    let kebabCased = '';
    let lastCharIndex;
    const camelCasedLength = camelCased.length;
    for (let nextCharIndex = 0; nextCharIndex <= camelCasedLength; nextCharIndex++) {
        const lastCharCode = lastCharIndex
            ? camelCased.charCodeAt(lastCharIndex)
            : undefined;
        const nextCharCode = camelCased.charCodeAt(nextCharIndex);
        if (lastCharCode &&
            inRange(lastCharCode, UTF16_ALPHA_LOWER_RANGE) &&
            inRange(nextCharCode, UTF16_ALPHA_UPPER_RANGE)) {
            kebabCased = kebabCased.concat('-');
        }
        kebabCased = kebabCased.concat(camelCased.charAt(nextCharIndex));
        lastCharIndex = nextCharIndex;
    }
    return kebabCased.toLowerCase();
}
