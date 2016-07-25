'use strict';

/**
 * A handler that implements reversible move of columns
 *
 * @param {sheet} sheet
 */
function MoveColumnHandler(sheet) {
  this._sheet = sheet;
}

MoveColumnHandler.$inject = [ 'sheet' ];

module.exports = MoveColumnHandler;



////// api /////////////////////////////////////////


/**
 * Move a column
 *
 * @param {Object} context
 */
MoveColumnHandler.prototype.execute = function(context) {

  context.previousRight = context.source.next;
  this._sheet.moveColumn(context.source, context.target, context.left);

};


/**
 * Undo move
 *
 * @param {Object} context
 */
MoveColumnHandler.prototype.revert = function(context) {
  if (context.previousRight) {
    // if it had a column below previously, we can move it back there again
    this._sheet.moveColumn(context.source, context.previousRight, true);
  } else {
    // if it was the last column before moving it, move it back there again
    this._sheet.moveColumn(context.source, this._sheet.getLastColumn(), false);
  }
};
