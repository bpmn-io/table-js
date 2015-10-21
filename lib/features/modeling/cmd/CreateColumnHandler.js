'use strict';

/**
 * A handler that implements reversible addition of columns.
 *
 * @param {sheet} sheet
 */
function CreateColumnHandler(sheet) {
  this._sheet = sheet;
}

CreateColumnHandler.$inject = [ 'sheet' ];

module.exports = CreateColumnHandler;



////// api /////////////////////////////////////////


/**
 * Appends a column to the sheet
 *
 * @param {Object} context
 */
CreateColumnHandler.prototype.execute = function(context) {
  if (context._previousColumn) {
    context.column.previous = context._previousColumn;
  }
  if (context._nextColumn) {
    context.column.next = context._nextColumn;
  }

  this._sheet.addColumn(context.column);

  context._previousColumn = context.column.previous;
  context._nextColumn = context.column.next;

  return context.column;
};


/**
 * Undo create by removing the column
 */
CreateColumnHandler.prototype.revert = function(context) {
  this._sheet.removeColumn(context.column);
};
