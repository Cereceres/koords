
module.exports = function(point, index, points) {
    return points.splice(index, 0, point);
};
