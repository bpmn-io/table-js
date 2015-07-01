'use strict';

var forEach = require('lodash/collection/forEach'),
    domDelegate = require('min-dom/lib/delegate');


var isPrimaryButton = require('diagram-js/lib/util/Mouse').isPrimaryButton;

/**
 * A plugin that provides interaction events for table elements.
 *
 * It emits the following events:
 *
 *   * element.hover
 *   * element.out
 *   * element.click
 *   * element.dblclick
 *   * element.mousedown
 *   * element.focus
 *   * element.blur
 *
 * Each event is a tuple { element, gfx, originalEvent }.
 *
 * Canceling the event via Event#preventDefault() prevents the original DOM operation.
 *
 * @param {EventBus} eventBus
 */
function InteractionEvents(eventBus, elementRegistry) {

  function fire(type, event) {
    var target = event.delegateTarget || event.target,
        gfx = target,
        element = elementRegistry.get(gfx),
        returnValue;

    if (!gfx || !element) {
      return;
    }

    returnValue = eventBus.fire(type, { element: element, gfx: gfx, originalEvent: event });

    if (returnValue === false) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  var handlers = {};

  function mouseHandler(type) {

    var fn = handlers[type];

    if (!fn) {
      fn = handlers[type] = function(event) {
        // only indicate left mouse button interactions and contextmenu
        if (isPrimaryButton(event) || type === 'element.contextmenu') {
          fire(type, event);
        }
      };
    }

    return fn;
  }

  var bindings = {
    mouseover: 'element.hover',
    mouseout: 'element.out',
    click: 'element.click',
    dblclick: 'element.dblclick',
    mousedown: 'element.mousedown',
    mouseup: 'element.mouseup',
    focus: 'element.focus',
    blur: 'element.blur',
    contextmenu: 'element.contextmenu'
  };

  var elementSelector = 'td';

  ///// event registration

  function isFocusEvent(event) {
    return event === 'focus' || event === 'blur';
  }

  function registerEvent(node, event, localEvent) {
    var handler = mouseHandler(localEvent);
    handler.$delegate = domDelegate.bind(node, elementSelector, event, handler, isFocusEvent(event));
  }

  function unregisterEvent(node, event, localEvent) {
    domDelegate.unbind(node, event, mouseHandler(localEvent).$delegate, isFocusEvent(event));
  }

  function registerEvents(node) {
    forEach(bindings, function(val, key) {
      registerEvent(node, key, val);
    });
  }

  function unregisterEvents(node) {
    forEach(bindings, function(val, key) {
      unregisterEvent(node, key, val);
    });
  }

  eventBus.on('sheet.destroy', function(event) {
    unregisterEvents(event.sheet);
  });

  eventBus.on('sheet.init', function(event) {
    registerEvents(event.sheet);
  });


  // API

  this.fire = fire;

  this.mouseHandler = mouseHandler;

  this.registerEvent = registerEvent;
  this.unregisterEvent = unregisterEvent;
}


InteractionEvents.$inject = [ 'eventBus', 'elementRegistry' ];

module.exports = InteractionEvents;


/**
 * An event indicating that the mouse hovered over an element
 *
 * @event element.hover
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the mouse has left an element
 *
 * @event element.out
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the mouse has clicked an element
 *
 * @event element.click
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the mouse has double clicked an element
 *
 * @event element.dblclick
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the mouse has gone down on an element.
 *
 * @event element.mousedown
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the mouse has gone up on an element.
 *
 * @event element.mouseup
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the element has gained focus.
 *
 * @event element.focus
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */

/**
 * An event indicating that the element has lost focus
 *
 * @event element.blur
 *
 * @type {Object}
 * @property {djs.model.Base} element
 * @property {element} gfx
 * @property {Event} originalEvent
 */
