
/**
* @function invSphericalCoords
 * Get the spherical coords from cartesian coords
 * @param {Number} theta
 * @param {Number} phi
 * @param {Number} radius
 * @returns {Array} - the spherical coords
 */
module.exports= function(point) {
    let x = point[0], y = point[1], z = point[2];
    let R = Math.sqrt(x * x + y * y + z * z),
        rho = Math.sqrt(x * x + y * y),
        theta = Math.acos(z / R) / Math.PI * 180,
        phi = (Math.acos(x / rho) + (1 - Math.sign(x)) / 2 * Math.PI) / Math.PI * 180;
    return [ theta, phi ];
}
