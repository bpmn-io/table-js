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
  this._sheet.addRow(context.row);
  return context.row;
};


/**
 * Undo create by removing the row
 */
CreateRowHandler.prototype.revert = function(context) {
  this._sheet.removeRow(context.row);
};
