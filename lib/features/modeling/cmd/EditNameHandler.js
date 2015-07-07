'use strict';

/**
 * A handler that implements reversible editing of the table name.
 *
 * @param {tableName} tableName
 */
function EditNameHandler(tableName) {
  this._tableName = tableName;
}

EditNameHandler.$inject = [ 'tableName' ];

module.exports = EditNameHandler;



////// api /////////////////////////////////////////


/**
 * Edits the table name
 *
 * @param {Object} context
 */
EditNameHandler.prototype.execute = function(context) {
  context.oldName = this._tableName.getName();
  this._tableName.setName(context.newName);
  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditNameHandler.prototype.revert = function(context) {
  this._tableName.setName(context.oldName);
  return context;
};
