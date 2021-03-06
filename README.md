# Koords

Provides basic geo operations

[![Build Status](https://travis-ci.org/Cereceres/koords.svg)](https://travis-ci.org/Cereceres/koords)
[![Inline docs](http://inch-ci.org/github/Cereceres/koords.svg?branch=master)](http://inch-ci.org/github/Cereceres/koords)

## Install

```bash
$ npm install koords
```

# Usage

For a given set of (2D)-points [[x1,y1],[x2,y2]....], we construct an anticlockwise polygon. We tell if a  point is inside of the polygon. 
```js

let koors = require('koords')

koords.containsLocation([
  [19.541297755574497, -99.30722236633301],
  [19.529811407768875, -99.30644989013672],
  [19.531510144485384, -99.28825378417969],
  [19.526656563613997, -99.25992965698242],
  [19.54388611549836, -99.25538063049316],
], [19.54388611549836, -99.25538063049316])
// Returns true or false

koords.getArea([[-1,1], [1,1], [1, -1], [-1,-1]])
// Returns the plane area of polygon given, in this case is 4

koords.getDistance({latitude : 0, longitude:0},{latitude:90,longitude:0})
// Returns the distance from Ecuador to Pole

koords.getAreaSpherical([[0,0],[10,0],[10,10]])
// Returns the spherical area of rectangle
// formed by the vertices [0,0],[10,0],[10,10].

```
Object with differents numerics methods to calculate the derivative of a function.

##Contributing
In lieu of a formal style guide, take care  of maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.  For any bugs, please contact to me via e-mail: cereceres@ciencias.unam.mx.


## License

The MIT License (MIT)

Copyright (c) 2015 Jesús Edel Cereceres Delgado [@Cereceres](https://github.com/Cereceres), Sergio Morlán Páramo[@serchserch](https://github.com/serchserch)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
