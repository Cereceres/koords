
/**
* @function insertPoint
 * Inserts new point into the polygon
 * @param point {Array} - New point
 * @param index {Array} - Position to insert
 * @param points {Array} - Polygon points
 * @returns {Array} - New polygon
 */
module.exports = function(point, index, points) {
    return points.splice(index, 0, point);
};
