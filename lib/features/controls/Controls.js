'use strict';

var domClasses = require('min-dom/lib/classes');
/**
 *  The controls module adds a container to the top-right corner of the table which holds
 *  some control elements
 */
function Controls(eventBus) {

  this._eventBus = eventBus;
  this.controlsContainer;

  var self = this;

  eventBus.on('sheet.init', function(evt) {

    var domNode = document.createElement('div');
    domClasses(domNode).add('tjs-controls');

    self.controlsContainer = domNode;
    evt.sheet.parentNode.appendChild(domNode);

    eventBus.fire('controls.init', {
      node: domNode,
      controls: self
    });

  });

}

Controls.prototype.addControl = function(label, fct) {
  this._eventBus.fire('controls.add', {
    label: label
  });

  var newNode = document.createElement('button');
  newNode.textContent = label;

  newNode.addEventListener('click', fct);

  this.controlsContainer.appendChild(newNode);

  this._eventBus.fire('controls.added', {
    label: label,
    node: newNode
  });

  return newNode;
};


Controls.$inject = [ 'eventBus' ];

module.exports = Controls;
