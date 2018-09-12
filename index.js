const findCentroid = require('./lib/find-centroid');
const transCoord = require('./lib/trans-coord');
const invTransCoord = require('./lib/inv-trans-coord');
const sortCounterclockwise = require('./lib/sort-counterclockwise');
const haversine = require('./lib/sines').haversine;
const ahaversine = require('./lib/sines').ahaversine;
const atan = require('./lib/atan');
const getPolygonArea = require('./lib/polygon-area');
const getNewPointPosition = require('./lib/new-point-position');
const fromCartesianToSpherical = require('./lib/inv-spherical-coords');
const getPolygonAreaRot = require('./lib/polygon-area-rot');

require('./truncate')();


const polarCoordinates = (CartesianPointsXandY) => CartesianPointsXandY
    .map((xAndY) => [
        Math.sqrt(xAndY[0] ** 2 + xAndY[1] ** 2), // Polar Radius coord
        atan(xAndY[0], xAndY[1]) // Polar Angle coord
    ]);


const insertPoint = (point, index, points) => points.splice(index, 0, point);


const getDistance = function(point1, point2) {
    let phi1 = point1.latitude / 180 * Math.PI,
        phi2 = point2.latitude / 180 * Math.PI,
        lambdpolygonArea = point1.longitude / 180 * Math.PI,
        lambda2 = point2.longitude / 180 * Math.PI;
    const earthRadius = 6371;
    const distance = earthRadius *
    ahaversine(haversine(phi1 - phi2) + Math.cos(phi2) * Math.cos(phi2) * haversine(lambdpolygonArea - lambda2));

    return distance;
};


getDistance.toMiles = function(point1, point2) {
    const earthRadius = 6371;
    let phi1 = point1.latitude / 180 * pi,
        phi2 = point2.latitude / 180 * pi,
        lambdpolygonArea = point1.longitude / 180 * pi,
        lambda2 = point2.longitude / 180 * pi;
    const distance = earthRadius *
    ahaversine(haversine(phi1 - phi2) + Math.cos(phi2) * Math.cos(phi2) * haversine(lambdpolygonArea - lambda2));
    return distance * 0.621371;
};


function fromSphericalToCartesian(theta, phi, radius) {
    const cartesian = {};
    cartesian.x = radius * Math.sin(theta) * Math.cos(phi),
    cartesian.y = radius * Math.sin(theta) * Math.sin(phi),
    cartesian.z = radius * Math.cos(theta);
    return Object.values(cartesian);
}


function stereographicProjection(point, radius) {
    const sphericalAngles = {};
    const cartesian = {};
    const pointProjected = {};


    sphericalAngles.theta = Math.PI / 2 - point.latitude / 180 * Math.PI;
    sphericalAngles.phi = point.longitude / 180 * Math.PI;

    [ cartesian.x, cartesian.y, cartesian.z ] =
                     fromSphericalToCartesian(sphericalAngles.theta, sphericalAngles.phi, radius);

    pointProjected.X = 2 * cartesian.x / (1 + cartesian.z);
    pointProjected.Y = 2 * cartesian.y / (1 + cartesian.z);

    return Object.values(pointProjected);
}


function invStereographicProjection(point) {
    const stereographic = {};
    const cartesian = {};
    const sphericalAngles = {};

    stereographic.X = point[0];
    stereographic.Y = point[1];

    cartesian.x = 4 * stereographic.X / (4 + stereographic.X ** 2 + stereographic.Y ** 2);
    cartesian.y = 4 * stereographic.Y / (4 + stereographic.X ** 2 + stereographic.Y ** 2);
    cartesian.z = 8 / (4 + stereographic.X ** 2 + stereographic.Y ** 2) - 1;

    [ sphericalAngles.theta, sphericalAngles.phi ] = fromCartesianToSpherical(Object.values(cartesian));

    sphericalAngles.theta = 90 - sphericalAngles.theta;

    return [ sphericalAngles.theta, sphericalAngles.phi ];
}


const containsLocation = function(polygon, location) {
    const orderedPolygon = sortCounterclockwise(polygon);
    const polygonArea = getPolygonArea(orderedPolygon);
    const center = findCentroid(orderedPolygon);
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


const getArea = function(polygon) {
    const center = findCentroid(polygon);
    const polygonTrans = transCoord(polygon, center);
    let polygonRotate = polarCoordinates(polygonTrans);
    polygonRotate = sortCounterclockwise(polygonRotate);
    const polygonAreaRotated = getPolygonAreaRot(polygonRotate);
    return polygonAreaRotated;
};


const fromPolarToCartesian = (pointsPolarFormRadiusAndAngle) => pointsPolarFormRadiusAndAngle.map(
    (rAndPhi) => [ rAndPhi[0] * Math.cos(rAndPhi[1]), // Cartesian X coord
        rAndPhi[0] * Math.sin(rAndPhi[1]) // Cartesian Y coord
    ]);

const getAreaSpherical = function(polygon) {
    const earthRadius = 6371;
    const projectedPolygon = [],
        l = polygon.length;
    for (let i = 0; i < l; i++) projectedPolygon[i] = stereographicProjection(
        { latitude :polygon[i][0], longitude :polygon[i][1] }, 1);

    const center = findCentroid(projectedPolygon);
    const polygonTrans = transCoord(projectedPolygon, center);
    let polygonRotate = polarCoordinates(polygonTrans);
    polygonRotate = sortCounterclockwise(polygonRotate);
    polygonRotate = fromPolarToCartesian(polygonRotate);
    polygonRotate = invTransCoord(polygonRotate, center);
    const sphericalPolygon = [];
    for (i = 0; i < l; i++) sphericalPolygon[i] = invStereographicProjection(polygonRotate[i]);

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
        a = Math.cos(thetpolygonArea) * Math.cos(theta2) +
           Math.sin(thetpolygonArea) * Math.sin(theta2) * Math.cos(phi1 - phi2);
        b = Math.cos(theta3) * Math.cos(theta2) +
           Math.sin(theta3) * Math.sin(theta2) * Math.cos(phi3 - phi2);
        c = Math.cos(theta3) * Math.cos(thetpolygonArea) +
           Math.sin(theta3) * Math.sin(thetpolygonArea) * Math.cos(phi3 - phi1);
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
