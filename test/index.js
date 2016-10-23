'use strict';

var cornerify = require('../');
var assert = require('chai').assert;
var toString = require('stream-to-string');
var fs = require('fs');
var path = require('path');

function fixture (name) {
  return fs.createReadStream(path.join(__dirname, 'fixtures', name));
}

function assertStreamsEqual (computedStream, expectedStream) {
  return Promise.all([
    toString(computedStream),
    toString(expectedStream)
  ]).then(function (values) {
    assert.equal(values[0], values[1]);
  });
}

function compare (inFixture, outFixture, changes) {
  return assertStreamsEqual(
    fixture(inFixture).pipe(cornerify(changes)),
    fixture(outFixture)
  );
}

describe('github-cornerify', function () {
  it('adds a corner in the left', function (done) {
    compare('input/index.html', 'output/left.html', {
      bg: 'red',
      fg: 'green',
      side: 'right',
      class: 'foo',
      zindex: 1234,
      url: 'http://example.com'
    }).then(done, done);
  });

  it('adds a corner in the right', function (done) {
    compare('input/index.html', 'output/right.html', {
      bg: 'red',
      fg: 'green',
      side: 'right',
      class: 'foo',
      zindex: 1234,
      url: 'http://example.com'
    }).then(done, done);
  });

  it('looks to package.json for the repo', function (done) {
    compare('input/index.html', 'output/default-url.html', {}).then(done, done);
  });
});

