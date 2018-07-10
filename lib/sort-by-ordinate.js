/**
* @function sortByOrdinate
 * Sorts the polygon points
 * @param points {Array} - Polygon points
 * @returns {Array} - Sorted poygon
 */

module.exports =  function(points) {
    let minor;
    for (let i = 1; i < points.length; i++) {
        for (let j = i; j > 0; j--) {
            if (points[j][1] < points[j - 1][1]) {
                minor = points[j];
                points[j] = points[j - 1];
                points[j - 1] = minor;
            } else {
                break;
            }
        }
    }
    return points;
};
