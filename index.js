'use strict';

var hyperstream = require('hyperstream');
var fs = require('fs');
var path = require('path');
var replace = require('stream-replace');
var uglifycss = require('uglifycss').processString;
var toStream = require('string-to-stream');
var wrap = require('wrap-stream');
var pkgUp = require('pkg-up');
var extend = require('util-extend');

module.exports = htmlInjectGithubCorner;

var gitRepoRegex = /^git:\/\/github.com\/([^\/]*)\/([^\.]*)(\.git)?$/;
var webRepoRegex = /^(git)?\+?(https?)?:\/\/(www\.)?github.com\/([^\/]*)\/([^\.]*)(\.git)?$/;

function assetStream (filename) {
  return fs.createReadStream(path.join(__dirname, 'assets', filename));
}

function assetContent (filename) {
  return fs.readFileSync(path.join(__dirname, 'assets', filename)).toString();
}

function svgStream (opts) {
  return assetStream('github-corner-' + opts.side + '.svg')
    .pipe(replace('BACKGROUND', opts.bg))
    .pipe(replace('FOREGROUND', opts.fg));
}

function cssContent () {
  return assetContent('styles.css');
}

function toCanonicalGitRepo (url) {
  var match;
  if ((match = url.match(gitRepoRegex))) {
    return 'https://github.com/' + match[1] + '/' + match[2];
  } else if ((match = url.match(webRepoRegex))) {
    return 'https://github.com/' + match[4] + '/' + match[5];
  }
}

function getRepo (pkg) {
  if (pkg && pkg.repository && typeof pkg.repository.url === 'string') {
    var url = pkg.repository.url;

    if (typeof url === 'string') {
      return toCanonicalGitRepo(url);
    } else {
      return url;
    }
  }
}

function getPkg () {
  var pkgPath = pkgUp.sync();
  return pkgPath ? JSON.parse(fs.readFileSync(pkgPath).toString()) : undefined;
}

function htmlInjectGithubCorner (opts) {
  var pkg = getPkg();

  opts = extend(pkg['github-corner'] || {}, opts || {});

  opts.side = opts.side === 'left' ? 'left' : 'right';
  opts.bg = opts.bg === undefined ? '#333' : opts.bg;
  opts.fg = opts.fg === undefined ? '#fff' : opts.fg;
  opts.zindex = opts.zindex === undefined ? 10000 : parseInt(opts.zindex);
  opts.class = opts.class === undefined ? 'github-corner' : opts.class;

  if (typeof opts.url !== 'string') {
    opts.url = getRepo(getPkg());
  }

  if (!opts.url) {
    throw new Error('Error: html-inject-github-corner was unable to find a repository url');
  }

  var svg = svgStream(opts)
    .pipe(wrap('<a href="' + opts.url + '" class="' + opts.class + '" aria-label="View source on Github">', '</a>'));

  var css = toStream(uglifycss(cssContent()))
    .pipe(replace('$LEFT', opts.side === 'left' ? '0' : 'auto'))
    .pipe(replace('$RIGHT', opts.side === 'left' ? 'auto' : '0'))
    .pipe(replace('$ZINDEX', opts.zindex))
    .pipe(replace(/\.github-corner/g, '.' + opts.class))
    .pipe(wrap('<style type="text/css">', '</style>'));

  return hyperstream({
    head: {_appendHtml: css},
    body: {_prependHtml: svg}
  });
}
