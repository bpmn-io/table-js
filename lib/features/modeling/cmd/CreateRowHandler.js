'use strict';

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function CreateRowHandler(sheet) {
  this._sheet = sheet;
}

CreateRowHandler.$inject = [ 'sheet' ];

module.exports = CreateRowHandler;



////// api /////////////////////////////////////////


/**
 * Appends a row to the sheet
 *
 * @param {Object} context
 */
CreateRowHandler.prototype.execute = function(context) {
  if (context._previousRow) {
    context.row.previous = context._previousRow;
  }
  if (context._nextRow) {
    context.row.next = context._nextRow;
  }

  this._sheet.addRow(context.row);

  context._previousRow = context.row.previous;
  context._nextRow = context.row.next;

  return context.row;
};


/**
 * Undo create by removing the row
 */
CreateRowHandler.prototype.revert = function(context) {
  this._sheet.removeRow(context.row);
};
