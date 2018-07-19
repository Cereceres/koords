
/**
* @function polygonArea
 * Calcs the plane area of polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */


module.exports = function(points) {
    var cumulativeArea=0;
    var previousVertex = points.slice(-1)[0];  // The last vertex is the 'previous' one to the first

    points.forEach( (point) => {
                    cumulativeArea += (previousVertex[0] +previousVertex[0]) * (previousVertex[1] - point[1]);
                    previousVertex= point;
                });

      return Math.abs(cumulativeArea / 2);
};
