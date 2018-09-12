'use strict';

const koords = require('../index');
const assert = require('assert');
const permutations = require('./permutations')();

require('../truncate')();
const messagePermutationsTest = `Consistency under permutations of points.
             If application  sorts vertices, points [[0,1/4],[1/4,0],[-1/4,0],[0,-1/4]]
          must be in the polygons formed by all permutations of the points
                  [[3/2, 3/2], [-1, 1], [-(3/2), -(3/2)], [1, 0]]`;

describe('Koords', () => {
    it('Should contains location (inside)', (done) => {
        const isPointInside = koords.containsLocation([
            [ 19.541297755574497, -99.30722236633301 ],
            [ 19.529811407768875, -99.30644989013672 ],
            [ 19.531510144485384, -99.28825378417969 ],
            [ 19.526656563613997, -99.25992965698242 ],
            [ 19.54388611549836, -99.25538063049316 ]
        ], [ 19.54388611549836, -99.25538063049316 ]);
        assert(isPointInside);
        done();
    });

    it('Shouldn\'t contains location (outside)', (done) => {
        const isPointInside = koords.containsLocation([
            [ 19.541297755574497, -99.30722236633301 ],
            [ 19.529811407768875, -99.30644989013672 ],
            [ 19.531510144485384, -99.28825378417969 ],
            [ 19.526656563613997, -99.25992965698242 ],
            [ 19.54388611549836, -99.25538063049316 ]
        ], [ 20.54388611549836, -99.25538063049316 ]);
        assert(!isPointInside);
        done();
    });


    it('The area of a polygon with vertices: [-1,1],[1,1],[1,-1],[-1,-1] is equal to 4', (done) => {
        const area = koords.getArea([ [
            -1,
            1
        ], [
            1,
            1
        ], [
            1,
            -1
        ], [
            -1,
            -1
        ] ]);
        assert(area === 4);
        done();
    });

    it('Distance from ecuador to pole is 40.007.161/4', (done) => {
        const distance = koords.getDistance({ latitude : 0, longitude:0 }, { latitude:90, longitude:0 });
        assert.equal(distance, 10007.543398010284);
        done();
    });

    it('The spherical area of a polygon with vertices: [0,0],[10,0],[10,10]', () => {
        const area = koords.getAreaSpherical([ [ 0, 0 ], [ 10, 0 ], [ 10, 10 ] ]).truncate(2);
        assert(area === 19649731.09);
    });


    it(messagePermutationsTest, () => {
        const points = [ [ 0, 1 / 4 ], [ 1 / 4, 0 ], [ 0, -1 / 4 ], [ -1 / 4, 0 ] ];
        const queryOnePointInAllPermutations = (point) => permutations
            .map((permutation) => koords.containsLocation(permutation, point))
            .every((result) => result);

        const queryAllPointsContained = points.every(queryOnePointInAllPermutations);
        assert(queryAllPointsContained === true);
    });
});
