'use strict';

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function DeleteRowHandler(sheet) {
  this._sheet = sheet;
}

DeleteRowHandler.$inject = [ 'sheet' ];

module.exports = DeleteRowHandler;



////// api /////////////////////////////////////////


/**
 * Appends a row to the sheet
 *
 * @param {Object} context
 */
DeleteRowHandler.prototype.execute = function(context) {
  this._sheet.removeRow(context.row);
  return context.row;
};


/**
 * Undo create by removing the row
 */
DeleteRowHandler.prototype.revert = function(context) {
  this._sheet.addRow(context.row);
};
