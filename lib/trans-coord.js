

/**
* @function transCoord
 * Translate coords
 * @param points {Array} - Polygon points
 * @param center {Array} - Center [x, y]
 * @returns {Array} - Translate coords
 */
module.exports = function(points, center) {
    const x = center[0];
    const y = center[1];
    const array = [];
    for (let i = 0; i < points.length; i++) {
        array[i] = [];
        array[i][0] = points[i][0] - x;
        array[i][1] = points[i][1] - y;
    }
    return array;
};
