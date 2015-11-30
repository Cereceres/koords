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

})
