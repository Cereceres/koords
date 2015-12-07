'use strict'

const koords = require('../index')
const assert = require('assert')

describe('Koords', () => {

  it('Should contains location (inside)', (done) => {

    let isPointInside = koords.containsLocation([[
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
    ]], [
       0,
       -1
    ])
    assert(isPointInside);
    done()
  })


  it('Shouldn\'t contains location (outside)', (done) => {

    let isPointInside = koords.containsLocation([[
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
    ]], [
       0,
       -3
    ])
    assert(!isPointInside);
    done()
  })


  it('The area of a polygon with vertices: [-1,1],[1,1],[1,-1],[-1,-1] is equal to 8', (done) => {

    let area = koords.getArea([[
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
    ]])
    console.log('area=',area);
    assert(area ===4);
    done()
  })

  it('The distance from ecuador to polo is 40.007.161/4', (done) => {

    let distance =  koords.getDistance({latitud : 0, longitud:0},{latitud:90,longitud:0})
    console.log('distance=',distance);
    assert.equal(distance,10007.543398010284);
    done()
  })



})
