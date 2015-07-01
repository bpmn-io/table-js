'use strict';

var forEach = require('lodash/collection/forEach');

/**
 * A handler that implements reversible clear of rows
 *
 * @param {sheet} sheet
 */
function DeleteRowHandler(sheet, elementRegistry, utilityColumn) {
  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
  this._utilityColumn = utilityColumn;
}

DeleteRowHandler.$inject = [ 'sheet', 'elementRegistry', 'utilityColumn' ];

module.exports = DeleteRowHandler;



////// api /////////////////////////////////////////


/**
 * Clear a row
 *
 * @param {Object} context
 */
DeleteRowHandler.prototype.execute = function(context) {
  var self = this;
  var utilityColumn = this._utilityColumn && this._utilityColumn.getColumn();
  var cells = this._elementRegistry.filter(function(element) {
    if(utilityColumn) {
      return element._type === 'cell' && element.row === context.row && element.column !== utilityColumn;
    } else {
      return element._type === 'cell' && element.row === context.row;
    }
  });
  context._oldContent = [];
  forEach(cells, function(cell) {
    context._oldContent.push(cell.content);
    self._sheet.setCellContent({row: context.row, column: cell.column, content: null});
  });
};


/**
 * Undo clear by resetting the content
 */
DeleteRowHandler.prototype.revert = function(context) {
  var self = this;
  var utilityColumn = this._utilityColumn && this._utilityColumn.getColumn();
  var cells = this._elementRegistry.filter(function(element) {
    if(utilityColumn) {
      return element._type === 'cell' && element.row === context.row && element.column !== utilityColumn;
    } else {
      return element._type === 'cell' && element.row === context.row;
    }
  });
  var i = 0;
  forEach(cells, function(cell) {
    self._sheet.setCellContent({row: context.row, column: cell.column, content: context._oldContent[i++]});
  });
};
