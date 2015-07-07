'use strict';

var forEach = require('lodash/collection/forEach'),
    distance = function distance(from, to) {
      var i = 0,
          current = from.column;
      while(current && current !== to.column) {
        current = current.next;
        i++;
      }
      return !current ? -1 : i;
    };

/**
 * The default renderer used for shapes and connections.
 *
 */
function Renderer(elementRegistry, eventBus) {
  this._elementRegistry = elementRegistry;
  this._eventBus = eventBus;
}

Renderer.$inject = [ 'elementRegistry', 'eventBus' ];

module.exports = Renderer;

Renderer.prototype.drawRow = function drawRow(gfx, data) {
  this._eventBus.fire('row.render', {
    gfx: gfx,
    data: data
  });
  return gfx;
};

Renderer.prototype.drawColumn = function drawColumn(gfx, data) {
  this._eventBus.fire('column.render', {
    gfx: gfx,
    data: data
  });
  return gfx;
};

Renderer.prototype.drawCell = function drawCell(gfx, data) {
  if(data.colspan) {
    gfx.setAttribute('colspan', data.colspan);
  }

  // traverse backwards to find colspanned elements which might overlap us
  var cells = this._elementRegistry.filter(function(element) {
    return element._type === 'cell' && element.row === data.row;
  });

  gfx.setAttribute('style', '');
  forEach(cells, function(cell) {
    var d = distance(cell, data);
    if(cell.colspan && d > 0 && d < cell.colspan) {
      gfx.setAttribute('style', 'display: none;');
    }
  });

  if(data.content) {
    if(typeof data.content === 'string' && !data.content.tagName) {
      gfx.childNodes[0].textContent = data.content;
    } else if(!!data.content.tagName) {
      gfx.childNodes[0].appendChild(data.content);
    }
  } else {
    gfx.childNodes[0].textContent = '';
  }

  this._eventBus.fire('cell.render', {
    gfx: gfx,
    data: data
  });

  return gfx;
};

