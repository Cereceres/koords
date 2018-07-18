
/**
* @function polygonAreaRot
 * Calcs the area of rotate polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */
 const cos=Math.cos;
 const sin=Math.sin;
 require('../truncate')();


module.exports = function(points) {

    let area = 0; // Accumulates area in the loop
    let j = points.length - 1; // The last vertex is the 'previous' one to the first
    let x1, x2, y1, y2, r1, theta1, r2, theta2;
    for (let i = 0; i < points.length; i++) {
        r1 = points[j][0];
        r2 = points[i][0];
        theta1 = points[j][1];
        theta2 = points[i][1];
        x1 = r1 * cos(theta1);
        x2 = r2 * cos(theta2);
        y1 = r1 * sin(theta1);
        y2 = r2 * sin(theta2);
        area = area + (x1 + x2) * (y1 - y2);
        j = i; // j is previous vertex to i
    }
    console.log(cos(theta1),sin(theta1))
    return Math.abs(area / 2);
};
