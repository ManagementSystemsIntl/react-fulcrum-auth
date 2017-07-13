# react-fulcrum-auth  [ ![Codeship Status for msi_ims/react-fulcrum-auth](https://app.codeship.com/projects/b30c3480-4a27-0135-1b75-5efc4f05ccd8/status?branch=master)](https://app.codeship.com/projects/232491)  [![npm version](https://badge.fury.io/js/react-fulcrum-auth.svg)](https://badge.fury.io/js/react-fulcrum-auth)

Add [Fulcrum](http://www.fulcrumapp.com/) authentication flow to your React app. Simply include the `<ReactFulcrumAuth />` component with `callback` and `appName` props to get a Bootstrap header with built-in authentication. Enter your Fulcrum credentials and choose an organization -- the `callback` prop returns a [Fulcrum API client](https://github.com/fulcrumapp/fulcrum-node) and name for the selected Fulcrum organization.

The authorization flow for this module was adapted from that of the [Fulcrum Query Utility](https://github.com/fulcrumapp/fulcrum-query-utility).


## Demo & Examples

Live demo: [ManagementSystemsIntl/react-fulcrum-auth](http://ManagementSystemsIntl.github.io/react-fulcrum-auth/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-fulcrum-auth is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-fulcrum-auth.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-fulcrum-auth --save
```


## Usage

As mentioned above, the component expects two props, `callback` and `appName`.
* `callback` references a method from the parent scope of this component, so that the parent can use and propagate the Fulcrum API client to other components.
* `appName` is simply for aesthetic purposes; it updates the text in the component's `<NavBar.Brand />` link subcomponent. If no prop is passed, `appName` defaults to "Fulcrum App".

```
var ReactFulcrumAuth = require('react-fulcrum-auth');
...

setFulcrum = (fulcrum, orgName) => {
  fulcrum.forms.search({}, ...);
  this.setState({ organization: orgName });
  ...
}

...
<ReactFulcrumAuth callback={ this.setFulcrum } appName={ "Cool App" }></ReactFulcrumAuth>
```

This component assumes that Bootstrap css is available in the webpage. If it isn't, you can include this stylesheet in the `<head>`:

```
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```


## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## License

The MIT License (MIT)

Copyright (c) 2014-present Stephen J. Collings, Matthew Honnibal, Pieter Vanderwerff

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
Copyright (c) 2017 Chase Gruber.
