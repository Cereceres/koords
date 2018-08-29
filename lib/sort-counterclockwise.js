module.exports = function(arraypoints) {
    const points = arraypoints
        .map((point) => ({ x:point[0], y:point[1] }));
    points.sort((a, b) => a.y - b.y);
    const cy = (points[0].y + points[points.length - 1].y) / 2;
    points.sort((a, b) => b.x - a.x);
    const cx = (points[0].x + points[points.length - 1].x) / 2;
    const center = { x:cx, y:cy };
    let startAng;
    points.forEach((point) => {
        let ang = Math.atan2(point.y - center.y, point.x - center.x);
        if(!startAng) {
            startAng = ang;
            ang = ang + Math.PI * 2;
        }
    });
    points.sort((a, b) => a.angle - b.angle);
    const ccwPoints = points.reverse();
    ccwPoints.unshift(ccwPoints.pop());
    const ccwArrayPoints = ccwPoints.map((obj) => Object.values(obj).slice(0, 2));
    return ccwArrayPoints;
};
