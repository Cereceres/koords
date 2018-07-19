
/**
* @function newPointPosition
 * Returns position of a given point pont
 * @param points {Array} - Polygon points
 * @param array {Array} - New Point
 * @returns {Number} - Position of new point
 */
module.exports = function(point, array) {
    let i;
    const theta = point[1];
    for (i = 0; i < array.length; i++) {
        const theta1 = array[i][1];
        if (theta <= theta1) {
            return i;
        }
    }
    return i;
};
