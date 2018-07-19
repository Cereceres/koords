/**
* @function sortByOrdinate
 * Sorts the polygon points
 * @param points {Array} - Polygon points
 * @returns {Array} - Sorted poygon
 */
module.exports = function(arraypoints) {
   //const points = [{x:?,y:?},{x:?,y:?},{x:?,y:?},...?];

   //const points=[];
   //arraypoints.forEach((point)=> {points.x = point[0],points.y = point[1]});
   const points=[];
     arraypoints.forEach((point) => points.push({x:point[0],y:point[1]}) );
   // Find min max to get center
   // Sort from top to bottom
   points.sort((a,b)=>a.y - b.y);

   // Get center y
   const cy = (points[0].y + points[points.length -1].y) / 2;

   // Sort from right to left
   points.sort((a,b)=>b.x - a.x);

   // Get center x
   const cx = (points[0].x + points[points.length -1].x) / 2;

   // Center point
   const center = {x:cx,y:cy};

   // Pre calculate the angles as it will be slow in the sort
   // As the points are sorted from right to left the first point
   // is the rightmost
   // Starting angle used to reference other angles
   var startAng;
   points.forEach(point => {
       var ang = Math.atan2(point.y - center.y,point.x - center.x);
       if(!startAng){ startAng = ang }
       else {
            if(ang < startAng){  // ensure that all points are clockwise of the start point
                ang += Math.PI * 2;
            }
       }
       point.angle = ang; // add the angle to the point
    });
    // first sort clockwise
     points.sort((a,b)=> a.angle - b.angle);

     // then reverse the order
     const ccwPoints = points.reverse();

     // move the last point back to the start
     ccwPoints.unshift(ccwPoints.pop());

     const ccwArrayPoints = ccwPoints.map((obj)=> Object.values(obj).slice(0,2));
//    console.log(ccwArrayPoints);
     return ccwArrayPoints;

};
