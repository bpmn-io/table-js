'use strict';

var forEach = require('lodash/collection/forEach');


/**
 * The basic modeling entry point.
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
function Modeling(eventBus, elementFactory, commandStack) {
  this._eventBus = eventBus;
  this._elementFactory = elementFactory;
  this._commandStack = commandStack;

  var self = this;

  eventBus.on('table.init', function() {
    // register modeling handlers
    self._registerHandlers(commandStack);
  });
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  return {
    'row.create': require('./cmd/CreateRowHandler'),
    'row.delete': require('./cmd/DeleteRowHandler'),

    'column.create': require('./cmd/CreateColumnHandler'),
    'column.delete': require('./cmd/DeleteColumnHandler'),

    'cell.edit': require('./cmd/EditCellHandler')
  };
};

/**
 * Register handlers with the command stack
 *
 * @param {CommandStack} commandStack
 */
Modeling.prototype._registerHandlers = function(commandStack) {
  forEach(this.getHandlers(), function(handler, id) {
    commandStack.registerHandler(id, handler);
  });
};


///// modeling helpers /////////////////////////////////////////

Modeling.prototype.createRow = function(row) {

  row = this._elementFactory.create('row', row);

  var context = {
    row: row
  };
  this._commandStack.execute('row.create', context);

  return context.row;
};

Modeling.prototype.createColumn = function(column) {

  column = this._elementFactory.create('column', column);

  var context = {
    column: column
  };

  this._commandStack.execute('column.create', context);

  return context.column;
};

Modeling.prototype.deleteRow = function(row) {

  var context = {
    row: row
  };

  this._commandStack.execute('row.delete', context);

  return context.row;
};

Modeling.prototype.deleteColumn = function(column) {

  var context = {
    column: column
  };

  this._commandStack.execute('column.delete', context);

  return context.column;
};

Modeling.prototype.editCell = function(row, column, content) {

  var context = {
    row: row,
    column: column,
    content: content
  };

  this._commandStack.execute('cell.edit', context);

  return context;
};
