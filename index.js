'use strict'

let pi = Math.PI
let pi2 = pi / 2
let earthR= 6371
var cos = Math.cos
var sin = Math.sin
var sqrt = Math.sqrt
require('./truncate')()

/**
 * Returns poligon center
 * @param points {Array} - Polygon points
 * @returns {Array} - Center [x, y]
 */
let findCentroid = function (points) {
  let x = 0,
    y = 0,
    l = points.length
  for (let i = 0; i < l; i++) {
    x = x + points[i][0]
    y = y + points[i][1]
  }
  x = x / l
  y = y / l
  return [x, y]
}

/**
 * Transform coords
 * @param points {Array} - Polygon points
 * @param center {Array} - Center [x, y]
 * @returns {Array} - Transformed coords
 */
let transCoord = function (points, center) {
  let x = center[0]
  let y = center[1]
  let array = []
  for (let i = 0; i < points.length; i++) {
    array[i] = []
    array[i][0] = points[i][0] - x
    array[i][1] = points[i][1] - y
  }
  return array
}

let invTransCoord = function (points, center) {
  let x = center[0]
  let y = center[1]
  let array = []
  for (let i = 0; i < points.length; i++) {
    array[i] = []
    array[i][0] = points[i][0] + x
    array[i][1] = points[i][1] + y
  }
  return array
}

/**
 * Transform coords
 * @param x {Number} - X
 * @param y {Number} - Y
 * @returns {Array} - Transformed coords
 */
let atan = function (x, y) {
  if (x !== 0) {
    let sign = Math.sign(x)
    return Math.atan(y / x) + pi * (1 - sign) / 2
  } else {
    var sign = Math.sign(y)
    return pi2 * (sign + 1) / 2 + (1 - sign) / 2 * 3 * pi2
  }
}

/**
 *  Rotates points of polygon
 * @param points {Array} - Polygon points
 * @returns {Array} - Rotated poygon
 */
let rotateCoord = function (points) {
  let array = [],
    r, x, y, theta
  for (let i = 0; i < points.length; i++) {
    x = points[i][0]
    y = points[i][1]
    r = sqrt(x * x + y * y)
    theta = atan(x, y)
    array[i] = [r, theta]
  }
  return array
}

/**
 * Sorts the polygon points
 * @param points {Array} - Polygon points
 * @returns {Array} - Sorted poygon
 */
let ordenate = function (points) {
  var minor
  for (var i = 1; i < points.length; i++) {
    for (var j = i; j > 0; j--) {
      if (points[j][1] < points[j - 1][1]) {
        minor = points[j]
        points[j] = points[j - 1]
        points[j - 1] = minor
      } else {
        break
      }
    }
  }
  return points
}

/**
 * Returns position for the new pont
 * @param points {Array} - Polygon points
 * @param array {Array} - New Point
 * @returns {Number} - Position of new point
 */
let limit = function (point, array) {
  let i
  let theta = point[1]
  for (i = 0; i < array.length; i++) {
    let theta1 = array[i][1]
    if (theta <= theta1) {
      return i
    }
  }
  return i
}

/**
 * Inserts new point into the polygon
 * @param point {Array} - New point
 * @param index {Array} - Position to insert
 * @param points {Array} - Polygon points
 * @returns {Array} - New polygon
 */
let insertPoint = function (point, index, points) {
  return points.splice(index, 0, point)
}

/**
 * Calcs the area of polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */
let polygonArea = function (points) {
  let area = 0 // Accumulates area in the loop
  let j = points.length - 1 // The last vertex is the 'previous' one to the first
  for (let i = 0; i < points.length; i++) {
    area = area + (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
    j = i; //j is previous vertex to i
  }
  return Math.abs(area / 2)
}

/**
 * Calcs the area of polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */
let polygonAreaRot = function (points) {
  let area = 0 // Accumulates area in the loop
  let j = points.length - 1 // The last vertex is the 'previous' one to the first
  let x1, x2, y1, y2, r1, theta1, r2, theta2
  for (let i = 0; i < points.length; i++) {
    r1 = points[j][0]
    r2 = points[i][0]
    theta1 = points[j][1]
    theta2 = points[i][1]
    x1 = r1 * cos(theta1)
    x2 = r2 * cos(theta2)
    y1 = r1 * sin(theta1)
    y2 = r2 * sin(theta2)
    area = area + (x1 + x2) * (y1 - y2)
    j = i //j is previous vertex to i
  }
  return Math.abs(area / 2)
}

function haversine(theta) {
    return Math.pow(sin(theta/2),2)
}


function ahaversine(x) {
    return 2*Math.asin(sqrt(x))
}

var getDistance =function (point1,point2) {
    let phi1 = point1.latitud/180*pi,
    phi2 = point2.latitud/180*pi,
    lambda1 = point1.longitud/180*pi,
    lambda2  = point2.longitud/180*pi
    let distance = earthR *
    ahaversine( haversine(phi1-phi2)+cos(phi2)*cos(phi2)*haversine(lambda1-lambda2)   )
    return distance
}
getDistance.toMiles =  function(point1,point2) {
    let phi1 = point1.latitud/180*pi,
    phi2 = point2.latitud/180*pi,
    lambda1 = point1.longitud/180*pi,
    lambda2  = point2.longitud/180*pi
    let distance = earthR *
    ahaversine( haversine(phi1-phi2)+cos(phi2)*cos(phi2)*haversine(lambda1-lambda2)   )
    return distance*0.621371
}

function sphericalCoords(theta,phi,radius){
    let x = radius*sin(theta)*cos(phi),
    y = radius*sin(theta)*sin(phi),
    z = radius*cos(theta)
    return [x,y,z]

}

function invSphericalCoords(point){
    var x = point[0],y= point[1],z= point[2]
    let R = sqrt(x*x+y*y+z*z),
    rho = sqrt(x*x+y*y),
    theta = Math.acos(z/R)/pi*180,
    phi = (Math.acos(x/rho)+(1-Math.sign(x))/2*pi)/pi*180
    return [theta,phi]

}
function stereographicProjection(point,radius){
    let theta = (pi2-point.latitud/180*pi),
    phi = point.longitud/180*pi,x,y,z
    var _point= sphericalCoords(theta,phi,radius)
    x = _point[0]
     y = _point[1]
    z = _point[2]
    let X =2*x/(1 + z),Y =2*y/(1 + z)
    return [X,Y]
}

function invStereographicProjection(point){
    let X=point[0], Y=point[1],s = 4/(4+X*X+Y*Y),
    x = s*X,y=s*Y ,z= 2*s-1
    var spherical = invSphericalCoords([x,y,z])
    return [(90-spherical[0]),spherical[1]]
}
 /**
  * @function containsLocation
  * @param {Array} set of points
  * @param {Array} location to test
 * @return {Boolean} true  if is inside or false other case
  */
let containsLocation = function (polygon, location) {
  let A1 = polygonArea(polygon)
  let center = findCentroid(polygon)
  let polygonTrans = transCoord(polygon, center)
  let polygonRotate = rotateCoord(polygonTrans)
  let locationTrans = transCoord([location], center)
  let locationRotate = rotateCoord(locationTrans)
  polygonRotate = ordenate(polygonRotate)
  let _limit = limit(locationRotate[0], polygonRotate)
  insertPoint(locationRotate[0], _limit, polygonRotate)
  let A2 = polygonAreaRot(polygonRotate)
  return (A2 <= A1)
}

let getArea= function (polygon) {
  let center = findCentroid(polygon)
  let polygonTrans = transCoord(polygon, center)
  let polygonRotate = rotateCoord(polygonTrans)
  polygonRotate = ordenate(polygonRotate)
  let A2 = polygonAreaRot(polygonRotate)
  return A2
}
let invRotateCoord = function (points) {
  let array = [],
    r, x, y, theta
  for (let i = 0; i < points.length; i++) {
    r = points[i][0]
    theta = points[i][1]
    x = r*cos(theta)
    y = r*sin(theta)
    array[i] = [x, y]
  }
  return array
}
let getAreaSpherical= function(polygon) {
  var projectedPolygon = [],
  l=polygon.length
  for (var i = 0; i < l; i++) {
    projectedPolygon[i]= stereographicProjection(
      {latitud :polygon[i][0],longitud :polygon[i][1] },1)
  }
  let center = findCentroid(projectedPolygon)
  let polygonTrans = transCoord(projectedPolygon, center)
  let polygonRotate = rotateCoord(polygonTrans)
  polygonRotate = ordenate(polygonRotate)
  polygonRotate = invRotateCoord(polygonRotate)
  polygonRotate= invTransCoord(polygonRotate, center)
  let sphericalPolygon = []
  for ( i = 0; i < l; i++) {
    sphericalPolygon[i]=invStereographicProjection(polygonRotate[i])
  }
  i = l-1
  var E=0,k,theta1,theta2 ,theta3 ,phi1,phi2 ,phi3,a,b,c,C

  for ( var j = 0; j < l; j++) {
    k=(j+1)%l
    phi1 = sphericalPolygon[i][0]/180*pi
    theta1 = sphericalPolygon[i][1]/180*pi
    phi2 = sphericalPolygon[j][0]/180*pi
    theta2 = sphericalPolygon[j][1]/180*pi
    phi3 = sphericalPolygon[k][0]/180*pi
    theta3 = sphericalPolygon[k][1]/180*pi
    a =cos(theta1)*cos(theta2)+sin(theta1)*sin(theta2)*cos(phi1 - phi2)
    b=cos(theta3)*cos(theta2)+sin(theta3)*sin(theta2)*cos(phi3 - phi2)
    c=cos(theta3)*cos(theta1)+sin(theta3)*sin(theta1)*cos(phi3 - phi1)
    C = Math.acos( (cos(c)-cos(a)*cos(b))/sin(a)/sin(b))
    E= E+C
    i=j
  }
  E = E-(l-2)*pi
  return E*earthR*earthR
}

module.exports = {

  containsLocation: containsLocation,
  getArea: getArea,
  getDistance:  getDistance,
  getAreaSpherical :getAreaSpherical

}
