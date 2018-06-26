> This library exposes ES modules. Use an ES module aware transpiler such as Webpack, Rollup or Browserify + babelify to bundle it for the browser.

# table-js

A blazing fast library for viewing and editing tables.

[![Build Status](https://travis-ci.org/bpmn-io/table-js.svg?branch=master)](https://travis-ci.org/bpmn-io/table-js)


## Hacking the Project

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