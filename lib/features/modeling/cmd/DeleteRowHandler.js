'use strict';

var forEach = require('lodash/collection/forEach');

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function DeleteRowHandler(sheet, elementRegistry) {
  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
}

DeleteRowHandler.$inject = [ 'sheet', 'elementRegistry' ];

module.exports = DeleteRowHandler;



////// api /////////////////////////////////////////


/**
 * Appends a row to the sheet
 *
 * @param {Object} context
 */
DeleteRowHandler.prototype.execute = function(context) {

  // save the neighbors
  context._next = context.row.next;
  context._previous = context.row.previous;

  // save the cells
  context._cells = this._elementRegistry.filter(function(element) {
    return element._type === 'cell' && element.row === context.row;
  });

  this._sheet.removeRow(context.row);
  return context.row;
};


/**
 * Undo create by removing the row
 */
DeleteRowHandler.prototype.revert = function(context) {
  context.row.next = context._next;
  context.row.previous = context._previous;

  this._sheet.addRow(context.row);

  var self = this;

  // relive the cells
  forEach(context._cells, function(cell) {
    self._sheet.setCellContent({ column: cell.column, row: context.row, content: cell.content });
  });
};
