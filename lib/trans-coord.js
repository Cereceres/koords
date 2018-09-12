

/**
* @function transCoord
 * Translate coords
 * @param points {Array} - Polygon points
 * @param center {Array} - Center [x, y]
 * @returns {Array} - Translate coords
 */
module.exports = (points, center) => points.map((point) => [ point[0] - center[0], point[1] - center[1] ]);
