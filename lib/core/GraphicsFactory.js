'use strict';

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

/**
 * Clears the graphical representation of the element and returns the
 * cleared visual.
 */
GraphicsFactory.prototype._clear = function(gfx) {

  while (gfx.firstChild) {
    gfx.removeChild(gfx.firstChild);
  }

  return gfx;
};

GraphicsFactory.prototype.create = function(type, element, parent) {
  var newElement;
  switch(type) {
    case 'row': newElement = document.createElement('tr'); break;
    case 'cell': newElement = document.createElement('td'); break;
  }
  if(newElement && type === 'row') {
    parent.insertBefore(newElement, element.next && this._elementRegistry.getGraphics(element.next));
  } else if(type === 'cell') {
    var neighboringCell = this._elementRegistry.filter(function(el) {
      return el.row === element.row && el.column === element.column.next;
    })[0];
    parent.insertBefore(newElement, neighboringCell && this._elementRegistry.getGraphics(neighboringCell));
  }
  return newElement || document.createElement('div');
};


GraphicsFactory.prototype.update = function(type, element, gfx) {

  // Do not update root element
  if (!element.parent) {
    return;
  }

  var visual = this._clear(gfx);

  // redraw
  if (type === 'row') {
    this._renderer.drawRow(visual, element);
  } else
  if (type === 'column') {
    this._renderer.drawColumn(visual, element);
  } else
  if (type === 'cell') {
    this._renderer.drawCell(visual, element);
  } else {
    throw new Error('unknown type: ' + type);
  }
};

GraphicsFactory.prototype.remove = function(element) {
  var gfx = this._elementRegistry.getGraphics(element);

  // remove
  gfx.parentNode && gfx.parentNode.removeChild(gfx);
};
