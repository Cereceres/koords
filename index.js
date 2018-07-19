const findCentroid = require('./lib/find-centroid');
const transCoord = require('./lib/trans-coord');
const invTransCoord = require('./lib/inv-trans-coord');
const sortCounterclockwise = require('./lib/sort-counterclockwise');
const haversine = require('./lib/sines').haversine;
const ahaversine = require('./lib/sines').ahaversine;
const atan = require('./lib/atan');
const getPolygonArea = require('./lib/polygon-area');
const getNewPointPosition = require('./lib/new-point-position');
const fromCartesianToSpherical=require('./lib/inv-spherical-coords');
const getPolygonAreaRot = require('./lib/polygon-area-rot');

require('./truncate')();

/**
 @function polarCoordinates
 *  Rotates points of polygon
 * @param points {Array} - Polygon points
 * @returns {Array} - Rotated poygon
 */

const polarCoordinates = (CartesianPointsXandY) => CartesianPointsXandY.map(
                                                        (xAndY) => [Math.sqrt(xAndY[0]**2 + xAndY[1]**2), //Polar Radius coord
                                                                       atan(xAndY[0],xAndY[1]) //Polar Angle coord
                                                                      ]);



/*
const polarCoordinates = function(points) {
      let pointspolar = [];

     const polarCoordinate= {};
     const cartesianCoordinate= {};

    for (let i = 0; i < points.length; i++) {
      cartesianCoordinate.x  = points[i][0];
      cartesianCoordinate.y = points[i][1];
      polarCoordinate.radius = Math.sqrt(cartesianCoordinate.x**2
                                           + cartesianCoordinate.y**2);
      polarCoordinate.angle = atan(cartesianCoordinate.x,cartesianCoordinate.y);
      pointspolar[i] = Object.values(polarCoordinate);
    }
    return pointspolar;
};
*/

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
 * @function getDistance
 * Get the distance between two points over a spherical surface.
 * @param {Object} with properties latitude and longitude.
 * @param {Object} with properties latitude and longitude.
 * @returns {Number} - Spherical distance
 */
const getDistance = function(point1, point2) {

   let  phi1 = point1.latitude / 180 * Math.PI,
        phi2 = point2.latitude / 180 * Math.PI,
        lambdpolygonArea = point1.longitude / 180 * Math.PI,
        lambda2 = point2.longitude / 180 * Math.PI;
    const earthRadius = 6371;
    const distance = earthRadius *
    ahaversine(haversine(phi1 - phi2) + Math.cos(phi2) * Math.cos(phi2) * haversine(lambdpolygonArea - lambda2));

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
    const  earthRadius = 6371;
    let phi1 = point1.latitude / 180 * pi,
        phi2 = point2.latitude / 180 * pi,
        lambdpolygonArea = point1.longitude / 180 * pi,
        lambda2 = point2.longitude / 180 * pi;
    const distance = earthRadius *
    ahaversine(haversine(phi1 - phi2) + Math.cos(phi2) * Math.cos(phi2) * haversine(lambdpolygonArea - lambda2));
    return distance * 0.621371;
};

/**
* @function fromSphericalToCartesian
 * Get the cartesian coords from spherical coords
 * @param {Number} theta
 * @param {Number} phi
 * @param {Number} radius
 * @returns {Array} - the cartesian coords
 */
function fromSphericalToCartesian(theta, phi, radius) {
    const cartesian={};
       cartesian.x = radius * Math.sin(theta) * Math.cos(phi),
       cartesian.y = radius * Math.sin(theta) * Math.sin(phi),
       cartesian.z = radius * Math.cos(theta);
    return  Object.values(cartesian);
}

/**
* @function stereographicProjection
 * Get the stereographic projection over the plane
 * @param {Object} with properties latitude and longitude
 * @param {Number} radius
 * @returns {Array} - the plane coords
 */
function stereographicProjection(point, radius) {

    const sphericalAngles={};
    const cartesian = {};
    const pointProjected={};


     sphericalAngles.theta = Math.PI/2 - point.latitude / 180 * Math.PI;
     sphericalAngles.phi = point.longitude / 180 * Math.PI;

    [ cartesian.x, cartesian.y, cartesian.z ] =
                     fromSphericalToCartesian(sphericalAngles.theta,sphericalAngles.phi,radius);

     pointProjected.X = 2 * cartesian.x / (1 + cartesian.z);
     pointProjected.Y = 2 * cartesian.y / (1 + cartesian.z);

    return Object.values(pointProjected);
}

/**
* @function invStereographicProjection
 * Get the inverse stereographic projection over the sphera
 * @param {Object} with properties latitude and longitude
 * @param {Number} radius
 * @returns {Array} - the spherical coords
 */
function invStereographicProjection(point) {

    const stereographic={};
    const cartesian={};
    const sphericalAngles={};

          stereographic.X = point[0];
          stereographic.Y = point[1];

          cartesian.x  = 4 * stereographic.X / (4 + stereographic.X**2 + stereographic.Y**2);
          cartesian.y  = 4 * stereographic.Y / (4 + stereographic.X**2 + stereographic.Y**2);
          cartesian.z  = 8 / (4 + stereographic.X**2 + stereographic.Y**2) - 1;

   [sphericalAngles.theta,sphericalAngles.phi] = fromCartesianToSpherical(Object.values(cartesian));

    sphericalAngles.theta = 90 - sphericalAngles.theta;

    return [sphericalAngles.theta, sphericalAngles.phi];
}

/**
  * @function containsLocation
  * @param {Array} set of points
  * @param {Array} location to test
 * @returns {Boolean} true  if is inside or false other case
  */
const containsLocation = function(polygon, location) {
    const  orderedPolygon = sortCounterclockwise(polygon);
    const polygonArea = getPolygonArea(orderedPolygon);
  //console.log('polygonArea ', polygonArea);
    const center = findCentroid(orderedPolygon);
    //console.log('center ', center);
    const polygonTrans = transCoord(orderedPolygon, center);
    let polygonRotate = polarCoordinates(polygonTrans);
    const locationTrans = transCoord([ location ], center);
    const locationRotate = polarCoordinates(locationTrans);
    polygonRotate = sortCounterclockwise(polygonRotate);
    const newPointPosition = getNewPointPosition(locationRotate[0], polygonRotate);
    insertPoint(locationRotate[0], newPointPosition, polygonRotate);
    const polygonAreaRotated = getPolygonAreaRot(polygonRotate);
    return polygonAreaRotated <= polygonArea;
};

/**
 * @function getArea
 * @param {Array} polygon
* @returns {Number} area overclosed by polygon
 */
const getArea = function(polygon) {
    const center = findCentroid(polygon);
    const polygonTrans = transCoord(polygon, center);
    let polygonRotate = polarCoordinates(polygonTrans);
    polygonRotate = sortCounterclockwise(polygonRotate);
    const polygonAreaRotated = getPolygonAreaRot(polygonRotate);
    return polygonAreaRotated;
};

/**
 * @function fromPolarToCartesian
 * @param {Array} polygon
* @returns {Array} polygon not Rotated
 */
const fromPolarToCartesian = (pointsPolarFormRadiusAndAngle)=> pointsPolarFormRadiusAndAngle.map(
                                     (rAndPhi) => [ rAndPhi[0]* Math.cos(rAndPhi[1]), // Cartesian X coord
                                                    rAndPhi[0]* Math.sin(rAndPhi[1]) // Cartesian Y coord
                                                  ]);

/*
const fromPolarToCartesian = function(pointsPolarForm) {

    const pointsCartesianForm = [];
    const polar={};
    const cartesian={};

    for (let i = 0; i < pointsPolarForm.length; i++) {

        polar.radius = pointsPolarForm[i][0];
        polar.angle = pointsPolarForm[i][1];

        cartesian.x = polar.radius * Math.cos(polar.angle);
        cartesian.y = polar.radius * Math.sin(polar.angle);

        pointsCartesianForm[i] = [ cartesian.x, cartesian.y ];
    }
    return pointsCartesianForm;
};
*/
/**
 * @function getAreaSpherical
 * @param {Array} polygon
* @returns {Number} spherical area overclosed by polygon
 */
const getAreaSpherical = function(polygon) {

    const earthRadius = 6371;
    let projectedPolygon = [],
        l = polygon.length;
    for (var i = 0; i < l; i++) {
        projectedPolygon[i] = stereographicProjection(
            { latitude :polygon[i][0], longitude :polygon[i][1] }, 1);
    }
    const center = findCentroid(projectedPolygon);
    const polygonTrans = transCoord(projectedPolygon, center);
    let polygonRotate = polarCoordinates(polygonTrans);
    polygonRotate = sortCounterclockwise(polygonRotate);
    polygonRotate = fromPolarToCartesian(polygonRotate);
    polygonRotate = invTransCoord(polygonRotate, center);
    const sphericalPolygon = [];
    for (i = 0; i < l; i++) {
        sphericalPolygon[i] = invStereographicProjection(polygonRotate[i]);
    }
    i = l - 1;
    let E = 0, k, thetpolygonArea, theta2, theta3, phi1, phi2, phi3, a, b, c, C;

    for (let j = 0; j < l; j++) {
        k = (j + 1) % l;
        phi1 = sphericalPolygon[i][0] / 180 * Math.PI;
        thetpolygonArea = sphericalPolygon[i][1] / 180 * Math.PI;
        phi2 = sphericalPolygon[j][0] / 180 * Math.PI;
        theta2 = sphericalPolygon[j][1] / 180 * Math.PI;
        phi3 = sphericalPolygon[k][0] / 180 * Math.PI;
        theta3 = sphericalPolygon[k][1] / 180 * Math.PI;
        a = Math.cos(thetpolygonArea) * Math.cos(theta2)
           + Math.sin(thetpolygonArea) * Math.sin(theta2) * Math.cos(phi1 - phi2);
        b = Math.cos(theta3) * Math.cos(theta2)
           + Math.sin(theta3) * Math.sin(theta2) * Math.cos(phi3 - phi2);
        c = Math.cos(theta3) * Math.cos(thetpolygonArea)
           + Math.sin(theta3) * Math.sin(thetpolygonArea) * Math.cos(phi3 - phi1);
        C = Math.acos((Math.cos(c) - Math.cos(a) * Math.cos(b)) / Math.sin(a) / Math.sin(b));
        E = E + C;
        i = j;
    }
    E = E - (l - 2) * Math.PI;
    return E * earthRadius * earthRadius;
};

module.exports = {
  stereographicProjection,
    polarCoordinates,
    containsLocation,
    getArea,
    getDistance,
    getAreaSpherical

};
