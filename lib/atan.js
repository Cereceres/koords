
/**
* @function atan
 * atan function
 * @param x {Number} - X
 * @param y {Number} - Y
 * @returns {Number} - theta
 */
module.exports = function(x, y) {
    if (x !== 0) {
        const sign = Math.sign(x);
        return Math.atan(y / x) +  Math.PI * (1 - sign) / 2;
    }
    const sign = Math.sign(y);
    return (Math.PI/2) * (sign + 1) / 2 + (1 - sign) / 2 * 3 *  (Math.PI/2);
};
