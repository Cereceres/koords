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

})
