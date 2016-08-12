'use strict';

var di = require('didi');


/**
 * Bootstrap an injector from a list of modules, instantiating a number of default components
 *
 * @ignore
 * @param {Array<didi.Module>} bootstrapModules
 *
 * @return {didi.Injector} a injector to use to access the components
 */
function bootstrap(bootstrapModules) {

  var modules = [],
      components = [];

  function hasModule(m) {
    return modules.indexOf(m) >= 0;
  }

  function addModule(m) {
    modules.push(m);
  }

  function visit(m) {
    if (hasModule(m)) {
      return;
    }

    (m.__depends__ || []).forEach(visit);

    if (hasModule(m)) {
      return;
    }

    addModule(m);
    (m.__init__ || []).forEach(function(c) {
      components.push(c);
    });
  }

  bootstrapModules.forEach(visit);

  var injector = new di.Injector(modules);

  components.forEach(function(c) {

    try {
      // eagerly resolve component (fn or string)
      injector[typeof c === 'string' ? 'get' : 'invoke'](c);
    } catch (e) {
      console.error('Failed to instantiate component');
      console.error(e.stack);

      throw e;
    }
  });

  return injector;
}

/**
 * Creates an injector from passed options.
 *
 * @ignore
 * @param  {Object} options
 * @return {didi.Injector}
 */
function createInjector(options) {

  options = options || {};

  var configModule = {
    'config': ['value', options]
  };

  var coreModule = require('./core');

  var modules = [ configModule, coreModule ].concat(options.modules || []);

  return bootstrap(modules);
}


/**
 * The main table-js entry point that bootstraps the table with the given
 * configuration.
 *
 * To register extensions with the table, pass them as Array<didi.Module> to the constructor.
 *
 * @class tjs.Table
 * @memberOf tjs
 * @constructor
 *
 * @param {Object} options
 * @param {Array<didi.Module>} [options.modules] external modules to instantiate with the table
 * @param {didi.Injector} [injector] an (optional) injector to bootstrap the table with
 */
function Table(options, injector) {

  // create injector unless explicitly specified
  this.injector = injector = injector || createInjector(options);

  // API

  /**
   * Resolves a table service
   *
   * @method Table#get
   *
   * @param {String} name the name of the table service to be retrieved
   * @param {Object} [locals] a number of locals to use to resolve certain dependencies
   */
  this.get = injector.get;

  /**
   * Executes a function into which table services are injected
   *
   * @method Table#invoke
   *
   * @param {Function|Object[]} fn the function to resolve
   * @param {Object} locals a number of locals to use to resolve certain dependencies
   */
  this.invoke = injector.invoke;

  // init

  // indicate via event


  /**
   * An event indicating that all plug-ins are loaded.
   *
   * Use this event to fire other events to interested plug-ins
   *
   * @memberOf Table
   *
   * @event table.init
   *
   * @example
   *
   * eventBus.on('table.init', function() {
   *   eventBus.fire('my-custom-event', { foo: 'BAR' });
   * });
   *
   * @type {Object}
   */
  this.get('eventBus').fire('table.init');
}

module.exports = Table;


/**
 * Destroys the table. This results in removing the attachment from the container.
 *
 * @method  Table#destroy
 */
Table.prototype.destroy = function() {
  this.get('eventBus').fire('table.destroy');

  // so we can reset the services directly used from diagram-js
  this.get('eventBus').fire('diagram.destroy');
};

/**
 * Clears the table. Should be used to reset the state of any stateful services.
 *
 * @method  Table#clear
 */
Table.prototype.clear = function() {
  this.get('eventBus').fire('table.clear');

  // so we can reset the services directly used from diagram-js
  this.get('eventBus').fire('diagram.clear');
};
