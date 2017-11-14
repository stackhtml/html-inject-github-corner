'use strict'

var hyperstream = require('hyperstream')
var fs = require('fs')
var path = require('path')
var replace = require('stream-replace')
var uglifycss = require('uglifycss').processString
var toStream = require('from2-string')
var wrap = require('wrap-stream')
var pkgUp = require('pkg-up')
var extend = require('util-extend')

module.exports = htmlInjectGithubCorner

var gitRepoRegex = /^git(:\/\/|@)github\.com\/([^/]*)\/([^.]*)(\.git)?$/
var webRepoRegex = /^(git)?\+?(https?)?:\/\/(www\.)?github\.com\/([^/]*)\/([^.]*)(\.git)?$/
var gitShortcutRegex = /^([^/]*)\/([^/]*)$/
var namedShortcutRegex = /^(gist):([^/]*)\/([^/]*)$/

function assetStream (filename) {
  return fs.createReadStream(path.join(__dirname, 'assets', filename))
}

function svgStream (opts) {
  return assetStream('github-corner-' + opts.side + '.svg')
    .pipe(replace('BACKGROUND', opts.bg))
    .pipe(replace('FOREGROUND', opts.fg))
}

function getRepoUrl (repository) {
  var match
  if (!repository) return
  var url = typeof repository === 'string' ? repository : repository.url
  if ((match = url.match(namedShortcutRegex))) {
    switch (match[1]) {
      case 'gist':
        return 'https://gist.github.com/' + match[2] + '/' + match[3]
    }
  } else if ((match = url.match(gitRepoRegex))) {
    return 'https://github.com/' + match[2] + '/' + match[3]
  } else if ((match = url.match(gitShortcutRegex))) {
    return 'https://github.com/' + match[1] + '/' + match[2]
  } else if ((match = url.match(webRepoRegex))) {
    return 'https://github.com/' + match[4] + '/' + match[5]
  }
  return url
}

function htmlInjectGithubCorner (opts) {
  var pkgPath = pkgUp.sync()
  var pkg = pkgPath ? JSON.parse(fs.readFileSync(pkgPath).toString()) : undefined

  opts = extend(pkg['github-corner'] || {}, opts || {})

  opts.side = opts.side === 'left' ? 'left' : 'right'
  opts.bg = opts.bg === undefined ? '#333' : opts.bg
  opts.fg = opts.fg === undefined ? '#fff' : opts.fg
  opts.position = opts.position === undefined ? 'absolute' : opts.position
  opts.zindex = opts.zindex === undefined ? 10000 : parseInt(opts.zindex)
  opts.class = opts.class === undefined ? 'github-corner' : opts.class

  var url = getRepoUrl(opts.repository || pkg.repository)

  if (!url) {
    throw new Error('Error: html-inject-github-corner was unable to find a repository url')
  }

  var svg = svgStream(opts)
    .pipe(wrap('<a href="' + url + '" class="' + opts.class + '" aria-label="View source on Github">', '</a>'))

  var css = toStream(uglifycss(fs.readFileSync(path.join(__dirname, 'assets', 'styles.css')).toString()))
    .pipe(replace('$LEFT', opts.side === 'left' ? '0' : 'auto'))
    .pipe(replace('$RIGHT', opts.side === 'left' ? 'auto' : '0'))
    .pipe(replace('$ZINDEX', opts.zindex))
    .pipe(replace('$POSITION', opts.position))
    .pipe(replace(/\.github-corner/g, '.' + opts.class))
    .pipe(wrap('<style type="text/css">', '</style>'))

  return hyperstream({
    head: {_appendHtml: css},
    body: {_prependHtml: svg}
  })
}
