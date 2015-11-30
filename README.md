# koords

## Installation

```bash
$ npm install koords
```


## Features



## API

### `koords`

Initialize `koords`

```js
var koords = require('koords');
```
##### `containsLocation`
With a set of points=[[x1,y1],[x2,y2]....] that form a polygon find is a point extra given is inside or out of the polygon given too.

```js
var points = [[-1,1],[1,1],[1,-1],[-1,-1]]
var point = [2,6]
koords.containsLocation(points,point)// => False
```

Object with differents numerics methods to calculate the derivative of a function.
##Contributing
In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.  For any bugs report please contact to me via e-mail: cereceres@ciencias.unam.mx.

##Licence
The MIT License (MIT)

Copyright (c) 2015 Jesús Edel Cereceres and Sergio Morlàn , 4yopping and all the related trademarks.

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
