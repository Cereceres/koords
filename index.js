const findCentroid = require('./lib/find-centroid');
const transCoord = require('./lib/trans-coord');
const invTransCoord = require('./lib/inv-trans-coord');
const sortByOrdinate = require('./lib/sort-by-ordinate');
const haversine = require('./lib/sines').haversine;
const ahaversine = require('./lib/sines').ahaversine;
const atan = require('./lib/atan');
const polygonArea = require('./lib/polygon-area');
const limit = require('./lib/limit');
const invSphericalCoords=require('./lib/inv-spherical-coords');


const pi = Math.PI;
const halfPi = pi / 2;
const earthR = 6371;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
require('./truncate')();

/**
 @function rotateCoord
 *  Rotates points of polygon
 * @param points {Array} - Polygon points
 * @returns {Array} - Rotated poygon
 */
const rotateCoord = function(points) {
    let array = [],
        r, x, y, theta;
    for (let i = 0; i < points.length; i++) {
        x = points[i][0];
        y = points[i][1];
        r = Math.sqrt(x * x + y * y);
        theta = atan(x, y);
        array[i] = [ r, theta ];
    }
    return array;
};


/**
* @function insertPoint
 * Inserts new point into the polygon
 * @param point {Array} - New point
 * @param index {Array} - Position to insert
 * @param points {Array} - Polygon points
 * @returns {Array} - New polygon
 */
const insertPoint = function(point, index, points) {
    return points.splice(index, 0, point);
};


/**
* @function polygonAreaRot
 * Calcs the area of rotate polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */
const polygonAreaRot = function(points) {
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
    return Math.abs(area / 2);
};
/**
 * @function getDistance
 * Get the distance between two points over a spherical surface.
 * @param {Object} with properties latitude and longitude.
 * @param {Object} with properties latitude and longitude.
 * @returns {Number} - Spherical distance
 */
const getDistance = function(point1, point2) {
    let phi1 = point1.latitude / 180 * pi,
        phi2 = point2.latitude / 180 * pi,
        lambda1 = point1.longitude / 180 * pi,
        lambda2 = point2.longitude / 180 * pi;
    const distance = earthR *
    ahaversine(haversine(phi1 - phi2) + cos(phi2) * cos(phi2) * haversine(lambda1 - lambda2));

    return distance;
};

/**
* @method  toMiles
 * Get the distance in miles units between two points over a spherical surface.
 * @param {Object} with properties latitude and longitude.
 * @param {Object} with properties latitude and longitude.
 * @returns {Number} - Spherical distance
 */
getDistance.toMiles = function(point1, point2) {
    let phi1 = point1.latitude / 180 * pi,
        phi2 = point2.latitude / 180 * pi,
        lambda1 = point1.longitude / 180 * pi,
        lambda2 = point2.longitude / 180 * pi;
    const distance = earthR *
    ahaversine(haversine(phi1 - phi2) + cos(phi2) * cos(phi2) * haversine(lambda1 - lambda2));
    return distance * 0.621371;
};

/**
* @function sphericalCoords
 * Get the cartesian coords from spherical coords
 * @param {Number} theta
 * @param {Number} phi
 * @param {Number} radius
 * @returns {Array} - the cartesian coords
 */
function sphericalCoords(theta, phi, radius) {
    let x = radius * Math.sin(theta) * Math.cos(phi),
        y = radius * Math.sin(theta) * Math.sin(phi),
        z = radius * Math.cos(theta);
    return [ x, y, z ];
}

/**
* @function stereographicProjection
 * Get the stereographic projection over the plane
 * @param {Object} with properties latitude and longitude
 * @param {Number} radius
 * @returns {Array} - the plane coords
 */
function stereographicProjection(point, radius) {
    let theta = halfPi - point.latitude / 180 * pi,
        phi = point.longitude / 180 * pi, x, y, z;
    const _point = sphericalCoords(theta, phi, radius);
    x = _point[0];
    y = _point[1];
    z = _point[2];
    let X = 2 * x / (1 + z), Y = 2 * y / (1 + z);
    return [ X, Y ];
}

/**
* @function invStereographicProjection
 * Get the inverse stereographic projection over the sphera
 * @param {Object} with properties latitude and longitude
 * @param {Number} radius
 * @returns {Array} - the spherical coords
 */
function invStereographicProjection(point) {
    let X = point[0], Y = point[1], s = 4 / (4 + X * X + Y * Y),
        x = s * X, y = s * Y, z = 2 * s - 1;
    const spherical = invSphericalCoords([ x, y, z ]);
    return [ 90 - spherical[0], spherical[1] ];
}

/**
  * @function containsLocation
  * @param {Array} set of points
  * @param {Array} location to test
 * @returns {Boolean} true  if is inside or false other case
  */
const containsLocation = function(polygon, location) {
    const A1 = polygonArea(polygon);
    console.log('A1 ', A1);
    const center = findCentroid(polygon);
    console.log('center ', center);
    const polygonTrans = transCoord(polygon, center);
    let polygonRotate = rotateCoord(polygonTrans);
    const locationTrans = transCoord([ location ], center);
    const locationRotate = rotateCoord(locationTrans);
    polygonRotate = sortByOrdinate(polygonRotate);
    const _limit = limit(locationRotate[0], polygonRotate);
    insertPoint(locationRotate[0], _limit, polygonRotate);
    const A2 = polygonAreaRot(polygonRotate);
    return A2 <= A1;
};

/**
 * @function getArea
 * @param {Array} polygon
* @returns {Number} area overclosed by polygon
 */
const getArea = function(polygon) {
    const center = findCentroid(polygon);
    const polygonTrans = transCoord(polygon, center);
    let polygonRotate = rotateCoord(polygonTrans);
    polygonRotate = sortByOrdinate(polygonRotate);
    const A2 = polygonAreaRot(polygonRotate);
    return A2;
};

/**
 * @function invRotateCoord
 * @param {Array} polygon
* @returns {Array} polygon not Rotated
 */
const invRotateCoord = function(points) {
    let array = [],
        r, x, y, theta;
    for (let i = 0; i < points.length; i++) {
        r = points[i][0];
        theta = points[i][1];
        x = r * cos(theta);
        y = r * sin(theta);
        array[i] = [ x, y ];
    }
    return array;
};

/**
 * @function getAreaSpherical
 * @param {Array} polygon
* @returns {Number} spherical area overclosed by polygon
 */
const getAreaSpherical = function(polygon) {
    let projectedPolygon = [],
        l = polygon.length;
    for (var i = 0; i < l; i++) {
        projectedPolygon[i] = stereographicProjection(
            { latitude :polygon[i][0], longitude :polygon[i][1] }, 1);
    }
    const center = findCentroid(projectedPolygon);
    const polygonTrans = transCoord(projectedPolygon, center);
    let polygonRotate = rotateCoord(polygonTrans);
    polygonRotate = sortByOrdinate(polygonRotate);
    polygonRotate = invRotateCoord(polygonRotate);
    polygonRotate = invTransCoord(polygonRotate, center);
    const sphericalPolygon = [];
    for (i = 0; i < l; i++) {
        sphericalPolygon[i] = invStereographicProjection(polygonRotate[i]);
    }
    i = l - 1;
    let E = 0, k, theta1, theta2, theta3, phi1, phi2, phi3, a, b, c, C;

    for (let j = 0; j < l; j++) {
        k = (j + 1) % l;
        phi1 = sphericalPolygon[i][0] / 180 * pi;
        theta1 = sphericalPolygon[i][1] / 180 * pi;
        phi2 = sphericalPolygon[j][0] / 180 * pi;
        theta2 = sphericalPolygon[j][1] / 180 * pi;
        phi3 = sphericalPolygon[k][0] / 180 * pi;
        theta3 = sphericalPolygon[k][1] / 180 * pi;
        a = cos(theta1) * cos(theta2) + sin(theta1) * sin(theta2) * cos(phi1 - phi2);
        b = cos(theta3) * cos(theta2) + sin(theta3) * sin(theta2) * cos(phi3 - phi2);
        c = cos(theta3) * cos(theta1) + sin(theta3) * sin(theta1) * cos(phi3 - phi1);
        C = Math.acos((cos(c) - cos(a) * cos(b)) / sin(a) / sin(b));
        E = E + C;
        i = j;
    }
    E = E - (l - 2) * pi;
    return E * earthR * earthR;
};

module.exports = {
  stereographicProjection,
    rotateCoord,
    containsLocation,
    getArea,
    getDistance,
    getAreaSpherical

};
