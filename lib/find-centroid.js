/**
* @function findCentroid
 * Returns poligon center
 * @param points {Array} - Polygon points
 * @returns {Array} - Center [x, y]
 */
module.exports = function(points) {
    let x = 0,
        y = 0,
        l = points.length;
    for (let i = 0; i < l; i++) {
        x = x + points[i][0];
        y = y + points[i][1];
    }
    x = x / l;
    y = y / l;
    return [ x, y ];
};
