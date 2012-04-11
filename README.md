# StreamClean

Removed unwanted lines from a stream. 

<a href="http://travis-ci.org/#!/DamonOehlman/streamclean"><img src="https://secure.travis-ci.org/DamonOehlman/streamclean.png" alt="Build Status"></a>


## Example Usage

Suppress comment lines with a regex:

```js
var streamclean = require('streamclean'),
    fs = require('fs'),
    path = require('path');
    
fs.createReadStream('input.js')
    .pipe(streamclean(/^\s*\/\//))
    .pipe(fs.createWriteStream('output.js')));
```
