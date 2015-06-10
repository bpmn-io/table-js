'use strict';

var assign = require('lodash/object/assign'),
    inherits = require('inherits');

function Base() {
  Object.defineProperty(this, 'businessObject', {
    writable: true
  });
}

function Table() {
  Base.call(this);
}

inherits(Table, Base);

function Row() {
  Base.call(this);
}

inherits(Row, Base);

function Column() {
  Base.call(this);
}

inherits(Column, Base);


var types = {
  table: Table,
  row: Row,
  column: Column
};

/**
 * Creates a new model element of the specified type
 *
 * @method create
 *
 * @example
 *
 * var shape1 = Model.create('shape', { x: 10, y: 10, width: 100, height: 100 });
 * var shape2 = Model.create('shape', { x: 210, y: 210, width: 100, height: 100 });
 *
 * var connection = Model.create('connection', { waypoints: [ { x: 110, y: 55 }, {x: 210, y: 55 } ] });
 *
 * @param  {String} type lower-cased model name
 * @param  {Object} attrs attributes to initialize the new model instance with
 *
 * @return {Base} the new model instance
 */
module.exports.create = function(type, attrs) {
  var Type = types[type];
  if (!Type) {
    throw new Error('unknown type: <' + type + '>');
  }
  return assign(new Type(), attrs);
};


module.exports.Table = Table;
module.exports.Row = Row;
module.exports.Column = Column;
