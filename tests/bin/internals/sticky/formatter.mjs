import { convertCamelCaseToKebabCase } from '../util/string.mjs';
function transformStyles(cssRules) {
    let styles = '';
    for (const ruleName in cssRules) {
        styles = styles.concat(`${convertCamelCaseToKebabCase(ruleName)}:${cssRules[ruleName]};`);
    }
    return styles;
}
export function formatSticky(message, ...styles) {
    const convertedStyles = styles.map(transformStyles);
    return [message, ...convertedStyles];
}
