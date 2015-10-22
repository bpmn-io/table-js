> The project is in an early development stage.
> For the time being, please refer to our [comprehensive test suite](https://github.com/dmn-io/table-js/tree/master/test/spec) for usage examples.


# table-js

A toolbox for displaying and modifying tables on the web.

[![Build Status](https://travis-ci.org/dmn-io/table-js.svg?branch=master)](https://travis-ci.org/dmn-io/table-js)

## Hacking the Project

To get the development setup ready execute

```
npm install
```


### Testing

Execute `grunt auto-test` to run the test suite in watch mode.

Expose an environment variable `TEST_BROWSERS=(Chrome|Firefox|IE)` to execute the tests in a non-headless browser.


### Package

Execute `grunt` to lint and test the project and to generate (preliminary) documentation.

We do not generate any build artifacts. Required parts of the library should be bundled by modelers / viewers as needed instead.


## License

MIT
