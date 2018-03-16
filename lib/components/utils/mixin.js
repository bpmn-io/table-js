import compose from './compose';

import { injectType } from './inject';


/**
 * A Component and injection aware mixin mechanism.
 *
 * @param {Component} component
 * @param {Object|Function} mixinDef
 */
export default function mixin(component, mixinDef) {

  Object.keys(mixinDef).forEach(function(key) {

    if (key === '$inject' || key === '__init') {
      return;
    }

    const mixinFn = mixinDef[key];

    if (key === 'constructor') {
      mixinFn.call(component, component.props, component.context);
    }

    const componentFn = component[key];

    if (typeof componentFn !== 'undefined') {
      if (typeof componentFn !== 'function') {
        throw new Error(
          `failed to mixin <${ key }>: cannot combine with non-fn component value`
        );
      }


      component[key] = compose(component, componentFn, mixinFn);
    } else {
      component[key] = mixinFn.bind(component);
    }
  });

  if ('$inject' in mixinDef) {
    injectType(mixinDef, component);
  }

  // call initializer
  if ('__init' in mixinDef) {
    mixinDef.__init.call(component, component.props, component.context);
  }

}