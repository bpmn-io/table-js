'use strict';

function performMouseEvent(type, element) {
  var evt;
  if (typeof MouseEvent !== 'function') {
    evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(type,true,true,'window',0,0,0,0,0,false,false,false,false,0,null);
  } else {
    evt = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window
    });
  }
  return element.dispatchEvent(evt);
}

module.exports.performMouseEvent = performMouseEvent;
