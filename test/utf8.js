var streamclean = require('../'),
    fs = require('fs'),
    path = require('path'),
    expect = require('expect.js');

function replace(targetFile, cleaner, done) {
    var lines = [];
    
    // read the reference output file
    fs.readFile(path.resolve(__dirname, 'output/' + targetFile), 'utf8', function(err, reference) {
        expect(err).to.not.be.ok();

        // create the input stream
        fs.createReadStream(path.resolve(__dirname, 'input/' + targetFile))
            .pipe(cleaner)
            .on('data', function(data) {
                lines[lines.length] = data;
            })
            .on('end', function() {
                // check the data against the reference data
                expect(lines.join('')).to.equal(reference);
                done();
            });
    });
}

describe('utf8 encoding replacement tests', function(done) {
    it('should be able to remove lines based on a regex', function(done) {
        replace('utf8/test.js', streamclean(/^\/\//), done);
    });
});