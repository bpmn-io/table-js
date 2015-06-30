'use strict';

var forEach = require('lodash/collection/forEach');

/**
 * A handler that implements reversible addition of columns.
 *
 * @param {sheet} sheet
 */
function DeleteColumnHandler(sheet, elementRegistry) {
  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
}

DeleteColumnHandler.$inject = [ 'sheet', 'elementRegistry' ];

module.exports = DeleteColumnHandler;



////// api /////////////////////////////////////////


/**
 * Appends a column to the sheet
 *
 * @param {Object} context
 */
DeleteColumnHandler.prototype.execute = function(context) {

  // save the neighbors
  context._next = context.column.next;
  context._previous = context.column.previous;

  // save the cells
  context._cells = this._elementRegistry.filter(function(element) {
    return element._type === 'cell' && element.column === context.column;
  });

  this._sheet.removeColumn(context.column);
  return context.column;
};


/**
 * Undo create by removing the column
 */
DeleteColumnHandler.prototype.revert = function(context) {
  context.column.next = context._next;
  context.column.previous = context._previous;

  this._sheet.addColumn(context.column);

  var self = this;

  // relive the cells
  forEach(context._cells, function(cell) {
    self._sheet.setCellContent({row: cell.row, column: context.column, content: cell.content});
  });
};
