'use strict';

var forEach = require('lodash/collection/forEach');


/**
 * The basic modeling entry point.
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
function Modeling(eventBus, elementFactory, commandStack, sheet) {
  this._eventBus = eventBus;
  this._elementFactory = elementFactory;
  this._commandStack = commandStack;
  this._sheet = sheet;

  var self = this;

  // high priority listener to make sure listeners are initialized when
  // subsequent setup steps ask whether operations are possible
  eventBus.on('table.init', 1500, function() {
    // register modeling handlers
    self._registerHandlers(commandStack);
  });
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  return {
    'row.create': require('./cmd/CreateRowHandler'),
    'row.delete': require('./cmd/DeleteRowHandler'),
    'row.clear': require('./cmd/ClearRowHandler'),
    'row.move': require('./cmd/MoveRowHandler'),

    'column.create': require('./cmd/CreateColumnHandler'),
    'column.delete': require('./cmd/DeleteColumnHandler'),

    'cell.edit': require('./cmd/EditCellHandler'),

    'name.edit': require('./cmd/EditNameHandler')
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

Modeling.prototype.moveRow = function(source, target, above) {
  var context = {
    source: source,
    target: target,
    above: above
  };

  this._commandStack.execute('row.move', context);

  return context;
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

Modeling.prototype.clearRow = function(row) {

  var context = {
    row: row
  };

  this._commandStack.execute('row.clear', context);

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

  if (content.trim() !== this._sheet.getCellContent(context)) {
    // only execute edit command if content changed
    this._commandStack.execute('cell.edit', context);
  }

  return context;
};

Modeling.prototype.editName = function(newName) {
  var context = {
    newName : newName
  };

  this._commandStack.execute('name.edit', context);

  return context;
};
