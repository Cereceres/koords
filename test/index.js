'use strict'

const koords = require('../index')
const assert = require('assert')

describe('Koords', () => {

  it('Should contains location (inside)', (done) => {

    let isPointInside = koords.containsLocation([
      [19.541297755574497, -99.30722236633301],
      [19.529811407768875, -99.30644989013672],
      [19.531510144485384, -99.28825378417969],
      [19.526656563613997, -99.25992965698242],
      [19.54388611549836, -99.25538063049316],
    ], [19.54388611549836, -99.25538063049316])
    assert(isPointInside);
    done()
  })

  it('Shouldn\'t contains location (outside)', (done) => {
    let isPointInside = koords.containsLocation([
      [19.541297755574497, -99.30722236633301],
      [19.529811407768875, -99.30644989013672],
      [19.531510144485384, -99.28825378417969],
      [19.526656563613997, -99.25992965698242],
      [19.54388611549836, -99.25538063049316],
    ], [20.54388611549836, -99.25538063049316])
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
    assert(area ===4);
    done()
  })

  it('The distance from ecuador to polo is 40.007.161/4', (done) => {

    let distance =  koords.getDistance({latitud : 0, longitud:0},{latitud:90,longitud:0})
    assert.equal(distance,10007.543398010284);
    done()
  })

  it('The area of a polygon with vertices: [-1,1],[1,1],[1,-1],[-1,-1] is equal to 8', (done) => {
    let area = koords.getAreaSpherical([[0,0],[10,0],[10,10]])
    assert(area ===19649731.095793243);
    done()
  })



})
