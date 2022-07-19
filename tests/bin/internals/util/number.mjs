export function compareAscending(a, b) {
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    return 0;
}
export function inRange(num, range, inclusive = true) {
    const [lowerBound, upperBound] = [...range].sort(compareAscending);
    return inclusive
        ? num >= lowerBound && num <= upperBound
        : num > lowerBound && num < upperBound;
}
export function inAnyRange(num, ranges, inclusive = true) {
    let found = false;
    for (const range of ranges) {
        found = inRange(num, range, inclusive);
        if (found)
            break;
    }
    return found;
}
