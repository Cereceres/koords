
module.exports = function(points) {
    const cartesian = {};
    const numberOfPoints = points.length;

    cartesian.x = 0;
    cartesian.y = 0;

    for (let i = 0; i < numberOfPoints; i++) {
        cartesian.x = cartesian.x + points[i][0];
        cartesian.y = cartesian.y + points[i][1];
    }
    cartesian.x = cartesian.x / numberOfPoints;
    cartesian.y = cartesian.y / numberOfPoints;

    return Object.values(cartesian);
};
