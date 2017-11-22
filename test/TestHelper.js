import uniq from 'lodash/uniq';
import forEach from 'lodash/forEach';

import Table from 'lib/Table';


let INSTANCE = null;


export function bootstrap(options, locals) {

  return function() {

    const { ...actualOpts } = options;

    var mockModule = {};

    forEach(locals, function(v, k) {
      mockModule[k] = [ 'value', v ];
    });

    actualOpts.modules = uniq(
      [].concat(
        options.modules || [],
        [ mockModule ]
      )
    );

    if (INSTANCE) {
      INSTANCE.destroy();
    }

    if (!actualOpts.renderer) {
      let container = document.createElement('div');

      document.body.appendChild(container);
      actualOpts.renderer = { container };
    }

    INSTANCE = new Table(actualOpts);
  };
}

export function inject(fn) {

  return function() {

    if (!INSTANCE) {
      throw new Error('no bootstrapped INSTANCE, call bootstrap(options, ...) first');
    }

    INSTANCE.invoke(fn);
  };

}