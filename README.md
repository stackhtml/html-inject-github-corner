# html-inject-github-corner

> Add a Github corner to a stream of html

[![Build Status][travis-image]][travis-url]
[![npm version][npm-image]][npm-url]
[![Dependency Status][david-dm-image]][david-dm-url]
[![Standard Style][standard-badge]][standard-url]
[![unstable][stability-unstable]][stability-url]

### Introduction

Tim Holman's [Github Corners](https://github.com/tholman/github-corners/) are great! This is a quick way to avoid having to copy/paste them by hand. 😀

### Installation

```bash
$ npm install html-inject-github-corner
```

### Example

This tool works great with [indexhtmlify](https://github.com/dominictarr/indexhtmlify) and [html-inject-meta](https://github.com/rreusser/html-inject-meta). For example:

```bash
$ browserify index.js | indexhtmlify | html-inject-meta | html-inject-github-corner > index.html
``` 
### Usage

This tools takes a stream of html and transforms it to include a github corner. It looks first to direct options, then to the `repository` field of the nearest `package.json`, and finally will accept any of these options from a `github-corner` field in `package.json`.

```
Options:
     --help  Display this message and exit
       --bg  Background color
       --fg  Foreground color
  --z-index  CSS z-index of corner (default: 10000)
 --position  CSS position of corner (default: 'absolute')
    --class  CSS class for element (default: 'github-corner')
      --url  Repository url (by default, looks at repository url of nearest package.json
     --side  Either "left" or "right"

  $ browserify index.js | indexhtmlify | html-inject-meta | html-inject-github-corner > index.html
```

### API

This can also be used as a through stream:

#### `require('html-inject-github-corner')([opts])`

This creates a through stream that transforms html to include a github corner. The options are exactly the same as for the command line version:

- `bg`: A valid CSS color for the triangular background
- `fg`: A valid CSS color for the octocat foreground
- `zIndex`: The z-index of the corner. Default is `10000`.
- `position`: The CSS position of the corner. Default is `'absolute'`.
- `repository`: A url to use in the link. Follows the format of the `package.json` `repository` field. If not provided, the nearest `package.json` will be located and analyzed. Within reason, will transformed to a web url.
- `side`: `'left' | 'right'`. Default side for the link is the right side.
- `class`: An optional CSS class for the element. Default is `.github-corner`.

**Returns**: A through stream that appends CSS into the head tag and prepends the github corner to the HTML.

### See Also

- [github-corners](https://github.com/tholman/github-corners/)
- [indexhtmlify](https://github.com/dominictarr/indexhtmlify)
- [html-inject-meta](https://github.com/rreusser/html-inject-meta)

### License

&copy; 2016 Ricky Reusser. MIT License. Original assets are adapted from [tholman/github-corners](https://github.com/tholman/github-corners). See [LICENSE](https://github.com/stackhtml/html-inject-github-corner/blob/master/LICENSE) for more details.


<!-- BADGES -->

[travis-image]: https://travis-ci.org/stackhtml/html-inject-github-corner.svg?branch=master
[travis-url]: https://travis-ci.org/stackhtml/html-inject-github-corner

[npm-image]: https://badge.fury.io/js/html-inject-github-corner.svg
[npm-url]: https://npmjs.org/package/html-inject-github-corner

[david-dm-image]: https://david-dm.org/stackhtml/html-inject-github-corner.svg?theme=shields.io
[david-dm-url]: https://david-dm.org/stackhtml/html-inject-github-corner

[standard-badge]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard

<!-- see stability badges at: https://github.com/badges/stability-badges -->
[stability-url]: https://github.com/badges/stability-badges
[stability-deprecated]: http://badges.github.io/stability-badges/dist/deprecated.svg
[stability-experimental]: http://badges.github.io/stability-badges/dist/experimental.svg
[stability-unstable]: http://badges.github.io/stability-badges/dist/unstable.svg
[stability-stable]: http://badges.github.io/stability-badges/dist/stable.svg
[stability-frozen]: http://badges.github.io/stability-badges/dist/frozen.svg
[stability-locked]: http://badges.github.io/stability-badges/dist/locked.svg
