
function haversine(theta) {
    return Math.pow(Math.sin(theta / 2), 2);
}


function ahaversine(x) {
    return 2 * Math.asin(Math.sqrt(x));
}


module.exports = {
    haversine,
    ahaversine
};
