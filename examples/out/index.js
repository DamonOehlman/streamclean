var Stream = require('stream'),
    util = require('util');

function Cleaner(tester, encoding) {
    Stream.call(this);
    
    this.writable = true;

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
    if (this.tester) {
        if (this.encoding) {
            this.emit('data', this._cleanEncoded(data, this.encoding));
        }
    }
    else {
        this.emit('data', data);
    }
};

Cleaner.prototype._cleanEncoded = function(data, encoding) {
    var changed = false,
        output = [],
        regex = this.tester instanceof RegExp ? this.tester : null,
        testFn = typeof this.tester == 'function' ? this.tester : null;

    data.toString(encoding).split(/\n/).forEach(function(line) {
        var stripLine = false;
        
        if (regex) {
            stripLine = regex.test(line);
        }
        else if (testFn) {
            stripLine = testFn(line);
        }

        if (! stripLine) {
            output[output.length] = line;
        }
        
        changed = changed || stripLine;
    });
    
    return changed ? new Buffer(output.join('\n')) : data;
};

module.exports = function(tester) {
    return new Cleaner(tester);
};