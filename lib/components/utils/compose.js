
/**
 * Composes a number of functions.
 *
 * All receive the the same arguments; the chain is interruped as soon
 * as one function returns a value.
 *
 * @param  {Object}    self
 * @param  {...Function} fns
 *
 * @return {Object}
 */
export default function compose(self, ...fns) {

  return function(...args) {

    let result;

    fns.forEach(function(fn) {

      result = fn.call(self, ...args);

      if (typeof result !== 'undefined') {
        return false;
      }
    });

    return result;
  }.bind(self);

}