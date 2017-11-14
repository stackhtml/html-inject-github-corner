'use strict'

var injectGithubCorner = require('../')
var toString = require('stream-to-string')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var test = require('tape')

function fixture (name) {
  return fs.createReadStream(path.join(__dirname, 'fixtures', name))
}

function assertStreamsEqual (computedStream, expectedStream) {
  return Promise.all([
    toString(computedStream),
    toString(expectedStream)
  ]).then(function (values) {
    assert.equal(values[0], values[1])
  })
}

function compare (inFixture, outFixture, config) {
  return assertStreamsEqual(
    fixture(inFixture).pipe(injectGithubCorner(config)),
    fixture(outFixture)
  )
}

test('adds a corner in the left', function (t) {
  compare('input/index.html', 'output/left.html', {
    bg: 'red',
    fg: 'green',
    side: 'right',
    class: 'foo',
    position: 'fixed',
    zindex: 1234,
    repository: 'http://example.com'
  }).then(t.end, t.end)
})

test('adds a corner in the right', function (t) {
  compare('input/index.html', 'output/right.html', {
    bg: 'red',
    fg: 'green',
    side: 'right',
    class: 'foo',
    zindex: 1234,
    repository: 'http://example.com'
  }).then(t.end, t.end)
})

test('looks to package.json for the repo', function (t) {
  compare('input/index.html', 'output/default-url.html', {}).then(t.end, t.end)
})

test('allows github ssh urls', function (t) {
  compare('input/index.html', 'output/github-shortcut-url.html', {
    repository: {
      url: 'git@github.com/foo/bar'
    }
  }).then(t.end, t.end)
})

test('uses a github shortcut url', function (t) {
  compare('input/index.html', 'output/github-shortcut-url.html', {
    repository: 'foo/bar'
  }).then(t.end, t.end)
})

test('allows pkg-style nested repository', function (t) {
  compare('input/index.html', 'output/github-shortcut-url.html', {
    repository: {
      url: 'foo/bar'
    }
  }).then(t.end, t.end)
})

test('uses a gist url', function (t) {
  compare('input/index.html', 'output/gist-url.html', {
    repository: 'gist:foo/bar'
  }).then(t.end, t.end)
})

test('uses a custom url', function (t) {
  compare('input/index.html', 'output/custom-url.html', {
    repository: 'https://foo.com/bar'
  }).then(t.end, t.end)
})
