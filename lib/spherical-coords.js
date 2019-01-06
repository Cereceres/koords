
module.exports = function(theta, phi, radius) {
    const cartesian = {};

    cartesian.x = radius * Math.sin(theta) * Math.cos(phi),
    cartesian.y = radius * Math.sin(theta) * Math.sin(phi),
    cartesian.z = radius * Math.cos(theta);

    return Object.values(cartesian);
};
