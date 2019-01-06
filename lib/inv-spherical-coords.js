
module.exports = function(point) {
    const cartesian = {};
    const spherical = {};

    [ cartesian.x, cartesian.y, cartesian.z ] = point;

    spherical.radius = Math.sqrt(cartesian.x ** 2 + cartesian.y ** 2 + cartesian.z ** 2);

    spherical.theta = Math.acos(cartesian.z / spherical.radius) / Math.PI * 180;

    spherical.rho = Math.sqrt(cartesian.x ** 2 + cartesian.y ** 2),
    spherical.phi = (Math.acos(cartesian.x / spherical.rho) +
                              (1 - Math.sign(cartesian.x)) / 2 * Math.PI) / Math.PI * 180;

    return [ spherical.rho, spherical.phi ];
};
