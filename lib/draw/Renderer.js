'use strict';

var forEach = require('lodash/collection/forEach');

function colDistance(from, to) {
  var i = 0,
      current = from.column;
  while (current && current !== to.column) {
    current = current.next;
    i++;
  }
  return !current ? -1 : i;
}

function rowDistance(from, to) {
  var i = 0,
      current = from.row;
  while (current && current !== to.row) {
    current = current.next;
    i++;
  }
  return !current ? -1 : i;
}

/**
 * The default renderer used for rows, columns and cells.
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
  if (data.colspan) {
    gfx.setAttribute('colspan', data.colspan);
  }
  if (data.rowspan) {
    gfx.setAttribute('rowspan', data.rowspan);
  }

  gfx.setAttribute('style', '');

  // traverse backwards to find colspanned elements which might overlap us
  var cells = this._elementRegistry.filter(function(element) {
    return element._type === 'cell' && element.row === data.row;
  });

  forEach(cells, function(cell) {
    var d = colDistance(cell, data);

    if (cell.colspan && d > 0 && d < cell.colspan) {
      gfx.setAttribute('style', 'display: none;');
    }
  });

  // traverse backwards to find rowspanned elements which might overlap us
  cells = this._elementRegistry.filter(function(element) {
    return element._type === 'cell' && element.column === data.column;
  });

  forEach(cells, function(cell) {
    var d = rowDistance(cell, data);
    
    if (cell.rowspan && d > 0 && d < cell.rowspan) {
      gfx.setAttribute('style', 'display: none;');
    }
  });

  if (data.content) {
    if (typeof data.content === 'string' && !data.content.tagName) {
      gfx.childNodes[0].textContent = data.content;
    } else if (data.content.tagName) {
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
