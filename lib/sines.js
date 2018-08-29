

/**
* @function haversine
 * Haversine function
 * @param {Number} theta
 * @returns {Number} - Haversine(theta)
 */
function haversine(theta) {
    return Math.pow(Math.sin(theta / 2), 2);
}

/**
* @function ahaversine
 * Haversine inverse function
 * @param {Number} theta
 * @returns {Number} - Haversine(theta)
 */
function ahaversine(x) {
    return 2 * Math.asin(Math.sqrt(x));
}


module.exports = {
    haversine,
    ahaversine
};
