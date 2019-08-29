/**
 * @file Solution file to Telerik's matching braces problem
 * @description The problem doesn't prescribe a particular storage medium
 * for housing the strings, so we assume we have them read already.
 * @author npd
 */

const some = Array.prototype.some;

/**
 * @param {string} expression - String containing a number of braces that we
 * parse
 * @returns {(string|null)} Indication of whether or not a string is braces-
 * balanced or not; null value indicates "" input string
 */
function bracesDoMatch(expression) {
    const OPEN_BRACES = ["[", "{", "("];
    const CLOSE_BRACES = ["]", "}", ")"];

    let result = null;
    let stack = [];

    /**
     * @param {string} current
     * @param {number} index
     * @param {Object} array
     * @returns {boolean}
     */
    function matchingHandler(current, index, array) {
        if (OPEN_BRACES.includes(current)) {
            stack.push(current);
        } else if (CLOSE_BRACES.includes(current)) {
            let unknownBrace = stack.pop();
            let closeIndex = CLOSE_BRACES.indexOf(current);
            let openIndex = OPEN_BRACES.indexOf(unknownBrace);

            if (closeIndex !== openIndex) {
                result = "NO";
                return true;
            }
        }

        if (0 === stack.length) {
            result = "YES";
        } else if (index === array.length - 1 && 0 < stack.length) {
            result = "NO";
        }
    }

    some.call(expression, matchingHandler);
    return result;
}

// Test case
//let result = ["{[()]}", "{[(])}", "{{[[(())]]}}"].map(doesMatch);
//console.log(result);
