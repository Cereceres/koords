
module.exports = (points, center) => points
    .map((point) => [point[0] - center[0], point[1] - center[1]]);
