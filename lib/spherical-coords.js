
/**
* @function sphericalCoords
 * Get the cartesian coords from spherical coords
 * @param {Number} theta
 * @param {Number} phi
 * @param {Number} radius
 * @returns {Array} - the cartesian coords
 */
module.exports= function(theta, phi, radius) {

    const cartesian={};
    
      cartesian.x = radius * Math.sin(theta) * Math.cos(phi),
      cartesian.y = radius * Math.sin(theta) * Math.sin(phi),
      cartesian.z = radius * Math.cos(theta);

    return Object.values(cartesian);
}
