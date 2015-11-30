'use strict'

let pi = Math.PI
let pi2 = pi / 2

/**
 *
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
 *
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

/**
 *
 */
function atan(x, y) {
  if (x !== 0) {
    let sign = Math.sign(x)
    return Math.atan(y / x)+pi * (1 - sign) / 2
  } else {
    var sign = Math.sign(y)
    return pi2 * (sign+1)/2 +(1-sign)/2*3*pi2
  }
}

/**
 *
 */
let rotateCoord = function (points) {
  let array = [],
    r, x, y, theta
  for (let i = 0; i < points.length; i++) {
    x = points[i][0]
    y = points[i][1]
    r = Math.sqrt(x * x + y * y)
    theta = atan(x, y)
    array[i] = [r, theta]
  }
  return array
}

function Ordenate(points) {
  var minor
  for (var i = 1; i < points.length; i++) {
    for (var j = i; j>0; j--) {
      if ( points[j][1]< points[j-1][1]) {
        minor  =points[j]
        points [j] = points[j-1]
        points[j-1] = minor
      }else { break}
    }
  }
  return points
}

/**
 *
 */
let limit = function (point, array) {
  let i
  let theta = point[1]
  for (i = 0; i < array.length; i++) {
    let theta1 = array[i][1]
    if (theta <= theta1 ) {
      return i
    }
  }
  return i
}

/**
 *
 */
let insertPoint = function (point, index, points) {
  return points.splice(index, 0, point)
}

/**
 *
 */
function polygonArea(points) {
  let area = 0 // Accumulates area in the loop
  let j = points.length - 1 // The last vertex is the 'previous' one to the first
  for (let i = 0; i < points.length; i++) {
    area = area + (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
    j = i; //j is previous vertex to i
  }
  return Math.abs(area / 2)
}

/**
 *
 */
function polygonAreaRot(points) {
  let area = 0 // Accumulates area in the loop
  let j = points.length - 1 // The last vertex is the 'previous' one to the first
  let x1, x2, y1, y2, r1, theta1, r2, theta2
  for (let i = 0; i < points.length; i++) {
    r1 = points[j][0]
    r2 = points[i][0]
    theta1 = points[j][1]
    theta2 = points[i][1]
    x1 = r1 * Math.cos(theta1)
    x2 = r2 * Math.cos(theta2)
    y1 = r1 * Math.sin(theta1)
    y2 = r2 * Math.sin(theta2)
    area = area + (x1 + x2) * (y1 - y2)
    j = i //j is previous vertex to i
  }
  return Math.abs(area / 2)
}

/**
 *
 */
module.exports = {
  containsLocation: function (polygon, location) {
    let A1 = polygonArea(polygon)
    let center = findCentroid(polygon)
    let polygonTrans = transCoord(polygon, center)
    let polygonRotate = rotateCoord(polygonTrans)    
    let locationTrans = transCoord([location], center)
    let locationRotate = rotateCoord(locationTrans)
    polygonRotate = Ordenate(polygonRotate)
    let _limit = limit(locationRotate[0], polygonRotate)
    insertPoint(locationRotate[0], _limit, polygonRotate)
    let A2 = polygonAreaRot(polygonRotate)
    return (A2 <= A1)
  }
}
