
/**
* @function polygonArea
 * Calcs the plane area of polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */
module.exports = function(points) {
    let area = 0; // Accumulates area in the loop
    let j = points.length - 1; // The last vertex is the 'previous' one to the first
    for (let i = 0; i < points.length; i++) {
        area = area + (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
        j = i; // j is previous vertex to i
    }
    return Math.abs(area / 2);
};
