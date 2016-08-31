'use strict';

var assign = require('lodash/object/assign');

function performMouseEvent(type, element, opts) {
  var evt, options,
      clientX = 0,
      clientY = 0,
      relatedTarget = null,
      defaults = {
        bubbles: true,
        cancelable: true,
        view: window
      };

  if (typeof MouseEvent !== 'function') {
    evt = document.createEvent('MouseEvents');

    if (opts) {
      clientX = opts.clientX || 0;
      clientY = opts.clientY || 0;
      relatedTarget = opts.relatedTarget || null;
    }

    evt.initMouseEvent(type, true, true, 'window', 0, 0, 0, clientX, clientY,
                       false, false, false, false, 0, relatedTarget);
  } else {

    options = assign(defaults, opts || {});

    evt = new MouseEvent(type, options);
  }

  return element.dispatchEvent(evt);
}

module.exports.performMouseEvent = performMouseEvent;


function performKeyEvent(type, element, opts) {
  var evt, options,
      ctrlKey,
      altKey,
      shiftKey,
      metaKey,
      keyCode,
      charCode,
      defaults = {
        bubbles: true,
        cancelable: true,
        view: window
      };

  if (typeof KeyboardEvent !== 'function') {
    evt = document.createEvent('KeyboardEvent');

    if (opts) {
      ctrlKey = opts.ctrlKey || false;
      altKey = opts.altKey || false;
      shiftKey = opts.shiftKey || false;
      metaKey = opts.metaKey || false;
      keyCode = opts.keyCode || 0;
      charCode = opts.charCode || 0;
    }

    event.initKeyEvent(type, true, true, null,
                       ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode);
  } else {
    options = assign(defaults, opts || {});

    evt = new Event(type, options);
  }

  return element.dispatchEvent(evt);
}


module.exports.performKeyEvent = performKeyEvent;


function createEvent(type, element) {
  var evt = document.createEvent('Event');

  evt.initEvent(type, true, true);

  return element.dispatchEvent(evt);
}


module.exports.createEvent = createEvent;
