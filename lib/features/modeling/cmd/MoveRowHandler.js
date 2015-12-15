'use strict';

/**
 * A handler that implements reversible move of rows
 *
 * @param {sheet} sheet
 */
function MoveRowHandler(sheet) {
  this._sheet = sheet;
}

MoveRowHandler.$inject = [ 'sheet' ];

module.exports = MoveRowHandler;



////// api /////////////////////////////////////////


/**
 * Move a row
 *
 * @param {Object} context
 */
MoveRowHandler.prototype.execute = function(context) {

  context.previousBelow = context.source.next;
  this._sheet.moveRow(context.source, context.target, context.above);

};


/**
 * Undo move
 *
 * @param {Object} context
 */
MoveRowHandler.prototype.revert = function(context) {
  if(context.previousBelow) {
    // if it had a row below previously, we can move it back there again
    this._sheet.moveRow(context.source, context.previousBelow, true);
  } else {
    // if it was the last row before moving it, move it back there again
    this._sheet.moveRow(context.source, this._sheet.getLastRow('body'), false);
  }
};
