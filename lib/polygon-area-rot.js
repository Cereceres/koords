/**
* @function getPolygonAreaRot
 * Calcs the area of rotate polygon
 * @param points {Array} - Polygon points
 * @returns {Number} - Poligon area
 */
 module.exports = function(polarPoints) {
    let partialArea = 0; // Accumulates area in the loop
    let j = polarPoints.length - 1; // The last vertex is the 'previous' one to the

    const cartesian={};
    const polar={};

    for (let i = 0; i < polarPoints.length; i++) {

        polar.radiusJ = polarPoints[j][0];
        polar.radiusI = polarPoints[i][0];

        polar.angleJ  = polarPoints[j][1];
        polar.angleI  = polarPoints[i][1];

        cartesian.xJ = (polar.radiusJ) * Math.cos(polar.angleJ);
        cartesian.xI  = (polar.radiusI) * Math.cos(polar.angleI);

        cartesian.yJ = (polar.radiusJ) * Math.sin(polar.angleJ);
        cartesian.yI  = (polar.radiusI) * Math.sin(polar.angleI);

        partialArea = partialArea
                      + (cartesian.xJ + cartesian.xI) * (  cartesian.yJ - cartesian.yI );

        j = i; // j is previous vertex to i
    }
    return Math.abs(partialArea / 2);
};
