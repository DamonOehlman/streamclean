var streamclean = require('../'),
    fs = require('fs'),
    path = require('path');
    
fs.createReadStream(path.resolve(__dirname, '../index.js'))
    .pipe(streamclean(/^\s*\/\//))
    .pipe(fs.createWriteStream(path.resolve(__dirname, 'out/index.js')));