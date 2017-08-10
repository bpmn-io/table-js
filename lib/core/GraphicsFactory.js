'use strict';

var forEach = require('lodash/collection/forEach');

/**
 * A factory that creates graphical elements
 *
 * @param {Renderer} renderer
 */
function GraphicsFactory(elementRegistry, renderer) {
  this._renderer = renderer;
  this._elementRegistry = elementRegistry;
}

GraphicsFactory.$inject = [ 'elementRegistry', 'renderer' ];

module.exports = GraphicsFactory;

GraphicsFactory.prototype.create = function(type, element, parent) {
  var newElement;

  switch (type) {

  case 'row':
    newElement = document.createElement('tr');
    break;

  case 'cell':
    
    // cells consist of a td element with a nested span which contains the content
    newElement = document.createElement(element.row.useTH ? 'th' : 'td');

    var contentContainer = document.createElement('span');
    
    newElement.appendChild(contentContainer);
    break;
  }

  if (newElement && type === 'row') {

    if (element.next) {
      parent.insertBefore(newElement, this._elementRegistry.getGraphics(element.next));
    } else {
      parent.appendChild(newElement);
    }

  } else if (type === 'cell') {

    var neighboringCell = this._elementRegistry.filter(function(el) {
      return el.row === element.row && el.column === element.column.next;
    })[0];

    if (neighboringCell) {
      parent.insertBefore(newElement, this._elementRegistry.getGraphics(neighboringCell));
    } else {
      parent.appendChild(newElement);
    }

  }
  return newElement || document.createElement('div');
};

GraphicsFactory.prototype.moveRow = function(source, target, above) {
  var gfxSource = this._elementRegistry.getGraphics(source);
  var gfxTarget;

  if (above) {
    gfxTarget = this._elementRegistry.getGraphics(target);
    gfxTarget.parentNode.insertBefore(gfxSource, gfxTarget);
  } else {

    if (source.next) {
      gfxTarget = this._elementRegistry.getGraphics(source.next);
      gfxTarget.parentNode.insertBefore(gfxSource, gfxTarget);
    } else {
      gfxSource.parentNode.appendChild(gfxSource);
    }

  }
};

GraphicsFactory.prototype.moveColumn = function(source, target, left) {
  var self = this;

  // find all cells which belong to the source and add them at their new place
  this._elementRegistry.forEach(function(element, gfx) {
    if (element._type === 'cell' && element.column === source) {

      // find the cell exactly right of them
      self._elementRegistry.forEach(function(targetElement, targetGfx) {
        if (targetElement._type === 'cell' && targetElement.row === element.row) {
          if (left && targetElement.column === target) {
            targetGfx.parentNode.insertBefore(gfx, targetGfx);
          } else if (!left && targetElement.column === source.next) {
            targetGfx.parentNode.insertBefore(gfx, targetGfx);
          }
        }
      });
    }
  });
};

// redraw complete table
GraphicsFactory.prototype.redraw = function() {
  var self = this;
  this._elementRegistry.forEach(function(element) {
    if (element._type === 'row') {
      self.update('row', element, self._elementRegistry.getGraphics(element));
    }
  });
};


GraphicsFactory.prototype.update = function(type, element, gfx) {

  // do not update root element
  if (!element.parent) {
    return;
  }

  var self = this;

  // redraw
  if (type === 'row') {

    this._renderer.drawRow(gfx, element);

    // also redraw all cells in this row
    forEach(this._elementRegistry.filter(function(el) {
      return el.row === element;
    }), function(cell) {
      self.update('cell', cell, self._elementRegistry.getGraphics(cell));
    });

  } else if (type === 'column') {

    this._renderer.drawColumn(gfx, element);

    // also redraw all cells in this column
    forEach(this._elementRegistry.filter(function(el) {
      return el.column === element;
    }), function(cell) {
      self.update('cell', cell, self._elementRegistry.getGraphics(cell));
    });

  } else if (type === 'cell') {
    this._renderer.drawCell(gfx, element);
  } else {
    throw new Error('unknown type: ' + type);
  }
};

GraphicsFactory.prototype.remove = function(element) {
  var gfx = this._elementRegistry.getGraphics(element);

  // remove
  gfx.parentNode && gfx.parentNode.removeChild(gfx);
};
