'use strict';

var unique = require('lodash/array/unique'),
    isFunction = require('lodash/lang/isFunction'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

var TestContainer = require('mocha-test-container-support');

var Table = require('../../lib/Table'),
    domEvent = require('min-dom/lib/event');

var OPTIONS, TABLE;


/**
 * Bootstrap the table given the specified options and a number of locals (i.e. services)
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapTable(function() {
 *     mockEvents = new Events();
 *
 *     return {
 *       events: mockEvents
 *     };
 *   }));
 *
 * });
 *
 * @param  {Object} (options) optional options to be passed to the table upon instantiation
 * @param  {Object|Function} locals  the local overrides to be used by the table or a function that produces them
 * @return {Function}         a function to be passed to beforeEach
 */
function bootstrapTable(options, locals) {

  return function() {

    var testContainer;


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


    var _options = options,
        _locals = locals;

    if (!_locals && isFunction(_options)) {
      _locals = _options;
      _options = null;
    }

    if (isFunction(_options)) {
      _options = _options();
    }

    if (isFunction(_locals)) {
      _locals = _locals();
    }

    _options = assign({ sheet: { container: testContainer } }, OPTIONS || {}, _options || {});

    var mockModule = {};

    forEach(_locals, function(v, k) {
      mockModule[k] = ['value', v];
    });

    _options.modules = unique([].concat(_options.modules || [], [ mockModule ]));

    TABLE = new Table(_options);
  };
}

/**
 * Injects services of an instantiated table into the argument.
 *
 * Use it in conjunction with {@link #bootstrapTable}.
 *
 * @example
 *
 * describe(function() {
 *
 *   var mockEvents;
 *
 *   beforeEach(bootstrapTable(...));
 *
 *   it('should provide mocked events', inject(function(events) {
 *     expect(events).toBe(mockEvents);
 *   }));
 *
 * });
 *
 * @param  {Function} fn the function to inject to
 * @return {Function} a function that can be passed to it to carry out the injection
 */
function inject(fn) {
  return function() {

    if (!TABLE) {
      throw new Error('no bootstraped table, ensure you created it via #bootstrapTable');
    }

    TABLE.invoke(fn);
  };
}


module.exports.bootstrapTable = (window || global).bootstrapTable = bootstrapTable;
module.exports.inject = (window || global).inject = inject;


function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

module.exports.insertCSS = insertCSS;

module.exports.getTableJS = function() {
  return TABLE;
};

function DomEventTracker() {

  this.install = function() {

    domEvent.__bind = domEvent.bind;
    domEvent.__unbind = domEvent.__unbind || domEvent.unbind;

    domEvent.bind = function(el, type, fn, capture) {
      el.$$listenerCount = (el.$$listenerCount || 0) + 1;
      return domEvent.__bind(el, type, fn, capture);
    };

    domEvent.unbind = function(el, type, fn, capture) {
      el.$$listenerCount = (el.$$listenerCount || 0) -1;
      return domEvent.__unbind(el, type, fn, capture);
    };
  };

  this.uninstall = function() {
    domEvent.bind = domEvent.__bind;
    domEvent.unbind = domEvent.__unbind;
  };
}

module.exports.DomMocking = new DomEventTracker();
