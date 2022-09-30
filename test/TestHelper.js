import {
  forEach
} from 'min-dash';

import TestContainer from 'mocha-test-container-support';

import Table from 'src/Table';


let TABLE_JS = null;


export function bootstrap(options = {}, locals = {}) {

  return function() {

    let testContainer;

    // Make sure the test container is an optional dependency and we fall back
    // to an empty <div> if it does not exist.
    //
    // This is needed if other libraries rely on this helper for testing
    // while not adding the mocha-test-container-support as a dependency.
    try {
      testContainer = TestContainer.get(this);
    } catch (e) {
      testContainer = document.createElement('div');
      document.body.appendChild(testContainer);
    }

    testContainer.classList.add('test-container');

    const { ...actualOpts } = options;

    var mockModule = {};

    forEach(locals, function(v, k) {
      mockModule[k] = [ 'value', v ];
    });

    actualOpts.modules = [].concat(
      options.modules || [],
      [ mockModule ]
    );

    if (TABLE_JS) {
      TABLE_JS.destroy();
    }

    if (!actualOpts.renderer) {
      actualOpts.renderer = {};
    }

    if (!actualOpts.renderer.container) {
      actualOpts.renderer.container = testContainer;
    }

    TABLE_JS = new Table(actualOpts);
  };
}

export function inject(fn) {

  return function() {

    if (!TABLE_JS) {
      throw new Error('no bootstrapped instance, call bootstrap(options, ...) first');
    }

    TABLE_JS.invoke(fn);
  };

}

export function getTableJS() {
  return TABLE_JS;
}