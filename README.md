> This library exposes [ES modules](http://exploringjs.com/es6/ch_modules.html#sec_basics-of-es6-modules). Use an ES module aware bundler such as [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org) to bundle it for the browser.

# table-js

A blazing fast library for viewing and editing tables.

[![Build Status](https://github.com/bpmn-io/table-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/table-js/actions?query=workflow%3ACI)


## Development

To get the development setup make sure to have [NodeJS](https://nodejs.org/en/download/) installed.
If your set up, clone the project and execute

```
npm install
```


### Testing

Execute `npm run dev` to run the test suite in watch mode.

Expose an environment variable `TEST_BROWSERS=(Chrome|Firefox|IE)` to execute the tests in a non-headless browser.


### Package

Execute `npm run all` to lint and test the project.

__Note:__ We do not generate any build artifacts. Required parts of the library should be bundled by library consumers as needed instead.


## License

MIT
