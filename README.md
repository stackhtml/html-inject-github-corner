# github-cornerify

> Add a Github corner to a stream of html

### Installation

```bash
$ npm install github-cornerify
```

### Example

This tool works great with [indexhtmlify](https://github.com/dominictarr/indexhtmlify) and [metadataify](https://github.com/rreusser/metadataify). For example:

```bash
$ browserify index.js | indexhtmlify | metadataify | github-cornerify > index.html
```

### Usage

This tools takes a stream of html and transforms it to include a github corner.

```
Options:
     --help  Display this message and exit
       --bg  Background color
       --fg  Foreground color
   --zindex  Z-index of corner
      --url  Repository url (by default, looks at repository
             url of nearest package.json
     --side  Either "left" or "right"
    --class  CSS class for element. By default, "github-corner"

  $ browserify index.js | indexhtmlify | metadataify | github-cornerify > index.html
```

### API

This can also be used as a through stream:

#### `require('github-cornerify')([opts])`

This creates a through stream that transforms html to include a github corner. The options are exactly the same as for the command line version:

- `bg`: A valid CSS color for the triangular background
- `fg`: A valid CSS color for the octocat foreground
- `zindex`: The z-index of the corner. Default is zero.
- `url`: A url to use in the link. If not provided, the nearest `package.json` will be located and analyzed. The `repository.url` field will be used and will be transformed to a web url—that is, the `git://` protocol is fine here.
- `side`: `'left' | 'right'`. Default side for the link is the right side.
- `class`: An optional CSS class for the element. Default is `.github-corner`.

**Returns**: A through stream that appends CSS into the head tag and prepends the github corner to the HTML.

### License

&copy; 2016 Ricky Reusser. MIT License. Original assets are adapted from [https://github.com/tholman/github-corners/blob/master/license.md](tholman/github-corners). See [LICENSE](LICENSE) for more details.
