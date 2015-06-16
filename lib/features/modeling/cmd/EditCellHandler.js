'use strict';

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function EditCellHandler(sheet) {
  this._sheet = sheet;
}

EditCellHandler.$inject = [ 'sheet' ];

module.exports = EditCellHandler;



////// api /////////////////////////////////////////


/**
 * Edits the content of the cell
 *
 * @param {Object} context
 */
EditCellHandler.prototype.execute = function(context) {
  context.oldContent = this._sheet.getCellContent(context);
  this._sheet.setCellContent(context);
  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditCellHandler.prototype.revert = function(context) {
  this._sheet.setCellContent({row: context.row, column: context.column, content: context.oldContent});
  return context;
};
