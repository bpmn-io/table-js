'use strict';

var forEach = require('lodash/collection/forEach'),
    assign = require('lodash/object/assign'),
    domDelegate = require('min-dom/lib/delegate'),
    domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    domAttr = require('min-dom/lib/attr'),
    domRemove = require('min-dom/lib/remove');

function ComplexCell(eventBus, sheet, elementRegistry) {

  this._eventBus = eventBus;
  this._sheet  = sheet;
  this._elementRegistry = elementRegistry;

  this.setupListeners();
}

ComplexCell.prototype.setupListeners = function() {
  var self = this;

  this._eventBus.on('element.click', function(event) {
    self.close();
    if(event.element && event.element.complex) {
      var gfx = self._elementRegistry.getGraphics(event.element);
      event.element.complex.position = {
        x: gfx.offsetLeft,
        y: gfx.offsetTop
      };

      self.open(event.element.complex);
    }
  });
};

ComplexCell.prototype.close = function() {
  if(this._current) {
    this._eventBus.fire('complexCell.close', this._current);

    domRemove(this._current.container);
    this._current = null;
  }
};

ComplexCell.prototype.isOpen = function() {
  return !!this._current;
};

ComplexCell.prototype._createContainer = function(className, position) {
  var container = domify('<div></div>');

  assign(container.style, {
    position: 'absolute',
    left: position.x + 'px',
    top: position.y  + 'px',
    width: 'auto',
    height: 'auto'
  });

  domClasses(container).add(className);

  return container;
};

ComplexCell.prototype.open = function(config) {
  var className = config.className || 'complex-cell',
      template = config.template;

  var position = {
    x: config.position.x + (config.offset && config.offset.x || 0),
    y: config.position.y + (config.offset && config.offset.y || 0)
  };

  // make sure, only one complex cell dialog is open at a time
  if (this.isOpen()) {
    this.close();
  }

  var sheet = this._sheet,
      parent = document.body,
      container = this._createContainer(className, position);

  this._attachContainer(container, parent);

  this._attachContent(template, container);

  this._current = {
    container: container,
    config: config
  };

  this._eventBus.fire('complexCell.open', this._current);

  return this;
};

/**
 * Attaches the container to the DOM.
 *
 * @param {Object} container
 * @param {Object} parent
 */
ComplexCell.prototype._attachContainer = function(container, parent) {
  // Attach to DOM
  parent.appendChild(container);
};

/**
 * Attaches the content to the container.
 *
 * @param {Object} container
 * @param {Object} parent
 */
ComplexCell.prototype._attachContent = function(content, container) {
  var self = this;

  // Attach to DOM
  container.appendChild(content);
};

ComplexCell.$inject = [ 'eventBus', 'sheet', 'elementRegistry' ];

module.exports = ComplexCell;
