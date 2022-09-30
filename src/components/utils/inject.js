export function inject(component) {

  const Type = component.constructor;

  return injectType(Type, component);
}


export function injectType(Type, component) {

  const annotation = Type.$inject;

  if (!annotation) {
    return;
  }

  const {
    injector
  } = component.context;

  const setupFn = [ ...annotation, function(...args) {

    for (const idx in args) {
      const name = annotation[idx];
      const value = args[idx];

      component[name] = value;
    }
  } ];

  injector.invoke(setupFn);
}