#! /usr/bin/env node

'use strict';

var cornerify = require('./');
var minimist = require('minimist');

if (process.stdin.isTTY) {
  printUsageAndExit();
}

var opts = minimist(process.argv.slice(2));

function printUsageAndExit () {
  console.error('Usage: github-cornerify < input.html > output.html');
  console.error('\n  Options:');
  console.error('       --help  Display this message and exit');
  console.error('         --bg  Background color');
  console.error('         --fg  Foreground color');
  console.error('     --zindex  Z-index of corner');
  console.error('        --url  Repository url (by default, looks at repository');
  console.error('               url of nearest package.json');
  console.error('       --side  Either "left" or "right"');
  console.error('      --class  CSS class for element. By default, "github-corner"');
  console.error('\n  Sample usage:');
  console.error('    $ browserify index.js | indexhtmlify | metadataify | github-cornerify > index.html');
  process.exit(1);
}

if (opts.help) {
  printUsageAndExit();
}

process.stdin
  .pipe(cornerify(opts))
  .pipe(process.stdout);
