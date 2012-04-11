var Stream = require('stream'),
    util = require('util');

function Cleaner(tester, encoding) {
    Stream.call(this);
    
    // initialise the stream as writable
    this.writable = true;

    // initialise the tester
    this.tester = tester;
    this.encoding = encoding || 'utf8';
}

util.inherits(Cleaner, Stream);

Cleaner.prototype.destroy = function() {
};

Cleaner.prototype.end = function() {
    this.emit('end');
};

Cleaner.prototype.write = function(data) {
    // if we have a tester, then do something
    if (this.tester) {
        // if we have an encoding then convert the data to a string, and split on line breaks
        if (this.encoding) {
            this.emit('data', this._cleanEncoded(data, this.encoding));
        }
    }
    // otherwise, just send the data through
    else {
        this.emit('data', data);
    }
};

Cleaner.prototype._cleanEncoded = function(data, encoding) {
    var changed = false,
        output = [],
        regex = this.tester instanceof RegExp ? this.tester : null,
        testFn = typeof this.tester == 'function' ? this.tester : null;

    // iterate through the lines
    data.toString(encoding).split(/\n/).forEach(function(line) {
        var stripLine = false;
        
        if (regex) {
            stripLine = regex.test(line);
        }
        else if (testFn) {
            stripLine = testFn(line);
            
            // if the stripline result is not a boolean (and not undefined)
            // then the line has been modified and should pass through in it's modified form
            // ... we'll tweak some variables to make it so
            if (typeof stripLine != 'undefined' && typeof stripLine != 'boolean') {
                line = stripLine;
                stripLine = false;
            }
        }

        // only push the line through if it hasn't been stripped
        if (! stripLine) {
            output[output.length] = line;
        }
        
        // update the changed status
        changed = changed || stripLine;
    });
    
    // create the new buffer
    return changed ? new Buffer(output.join('\n')) : data;
};

module.exports = function(tester) {
    return new Cleaner(tester);
};