'use strict';

var assign = require('lodash/object/assign'),
    domClasses = require('min-dom/lib/classes'),
    domRemove = require('min-dom/lib/remove');


/**
 *  A ComplexCell is a table cell that renders a template on click
 *  This can be used for cells containing complex data that can not be edited inline
 *
 *  In order to define a cell as complex, the cell must have a special property complex defining
 *  the configuration of the cell such as template or position:
 *
 *  Complex Property:
 *     - template: {DOMNode}
 *              HTML template of the complex content
 *     - className: {String} (optional, defaults to 'complex-cell')
 *              Defines the className which is set on the container of the complex cell
 *     - offset: {Object} (option, defaults to {x: 0, y: 0})
 *              Defines the offset of the template from the top left corner of the cell
 *
 *  Additional properties can be added to the complex object to retrieve them in events.
 *
 * Example:
 * cell.complex = {
 *      className: 'dmn-clauseexpression-setter',
 *      template: domify('<div>Hello World</div>'),
 *      type: 'mapping',
 *      offset: { x: 0, y: 10 }
 * };
 */
function ComplexCell(eventBus, elementRegistry) {

  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;

  this.setupListeners();
}


ComplexCell.prototype.setupListeners = function() {
  var self = this;

  // click on body closes open complex cells
  document.body.addEventListener('click', function(event) {
    if(!event.preventDialogClose) {
      self.close();
    }
  });

  // click on elements close potentially open complex cells
  // and open a complex cell at the position of the cell
  this._eventBus.on('element.click', function(event) {

    self.close();

    // set flag on original event to prevent closing the opened dialog
    // this only applies if the event has an original event (so it was generated
    // from a browser event that travels the dom tree)
    if(event.originalEvent) {
      event.originalEvent.preventDialogClose = true;
    }

    if(event.element && event.element.complex) {

      // calculate position based on the position of the cell
      var gfx = self._elementRegistry.getGraphics(event.element);

      // traverse the offset parent chain to find the offset sum
      var e = gfx;
      var offset = {x:0,y:0};
      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }

      event.element.complex.position = {
        x: offset.x,
        y: offset.y
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

/**
 * Creates a container that holds the template
 */
ComplexCell.prototype._createContainer = function(className, position) {
  var container = document.createElement('div');

  assign(container.style, {
    position: 'absolute',
    left: position.x + 'px',
    top: position.y  + 'px',
    width: 'auto',
    height: 'auto'
  });

  // stop propagation of click events on the container to avoid closing the template
  container.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  domClasses(container).add(className);

  return container;
};

ComplexCell.prototype.open = function(config) {
  var className = config.className || 'complex-cell',
      template = config.template;

  // make sure, only one complex cell dialog is open at a time
  if (this.isOpen()) {
    this.close();
  }

  // apply the optional offset configuration to the calculated position
  var position = {
    x: config.position.x + (config.offset && config.offset.x || 0),
    y: config.position.y + (config.offset && config.offset.y || 0)
  };

  var parent = document.body,

      // create the template container
      container = this._createContainer(className, position);

  // attach the template container to the document body
  this._attachContainer(container, parent);

  // attach the template node to the container
  this._attachContent(template, container);

  // save the currently open complex cell
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
  container.appendChild(content);
};

ComplexCell.$inject = [ 'eventBus', 'elementRegistry' ];

module.exports = ComplexCell;
