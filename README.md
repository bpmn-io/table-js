# table-js

A blazing fast library for viewing and editing tables.

[![Build Status](https://travis-ci.org/bpmn-io/table-js.svg?branch=master)](https://travis-ci.org/bpmn-io/table-js)

## Setup

Run

```
npm install
```

to install all dependencies.

### Test

Run

```
npm test
```

or

```
npm run dev
```

to run tests.

Tests are running in Chrome Headless by default. Set environment variable `TEST_BROWSERS=(Chrome|Firefox|IE)` to run the tests in a non-headless browser.

### Package

Execute npm run all to lint and test the project.

Note: We do not generate any build artifacts. Required parts of the library should be bundled by modelers / viewers as needed instead.

## License

MIT