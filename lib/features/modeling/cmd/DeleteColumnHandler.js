'use strict';

/**
 * A handler that implements reversible addition of columns.
 *
 * @param {sheet} sheet
 */
function DeleteColumnHandler(sheet) {
  this._sheet = sheet;
}

DeleteColumnHandler.$inject = [ 'sheet' ];

module.exports = DeleteColumnHandler;



////// api /////////////////////////////////////////


/**
 * Appends a column to the sheet
 *
 * @param {Object} context
 */
DeleteColumnHandler.prototype.execute = function(context) {
  this._sheet.removeColumn(context.column);
  return context.column;
};


/**
 * Undo create by removing the column
 */
DeleteColumnHandler.prototype.revert = function(context) {
  this._sheet.addColumn(context.column);
};
