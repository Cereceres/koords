
/**
* @function sphericalCoords
 * Get the cartesian coords from spherical coords
 * @param {Number} theta
 * @param {Number} phi
 * @param {Number} radius
 * @returns {Array} - the cartesian coords
 */
module.exports= function(theta, phi, radius) {
    let x = radius * sin(theta) * cos(phi),
        y = radius * sin(theta) * sin(phi),
        z = radius * cos(theta);
    return [ x, y, z ];
}
