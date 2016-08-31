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
