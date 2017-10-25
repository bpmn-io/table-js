import forEach from 'lodash/forEach';

import { Base } from 'lib/model';

import AddRowHandler from './cmd/AddRowHandler';
import RemoveRowHandler from './cmd/RemoveRowHandler';
import MoveRowHandler from './cmd/MoveRowHandler';
import AddColHandler from './cmd/AddColHandler';
import RemoveColHandler from './cmd/RemoveColHandler';
import MoveColHandler from './cmd/MoveColHandler';
import EditCellHandler from './cmd/EditCellHandler';


/**
 * The basic modeling entry point.
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
export default class Modeling {

  constructor(eventBus, elementFactory, commandStack) {
    this._eventBus = eventBus;
    this._elementFactory = elementFactory;
    this._commandStack = commandStack;

    eventBus.on('table.init', () => {

      // register modeling handlers
      registerHandlers(this.getHandlers(), commandStack);
    });
  }


  getHandlers() {
    return Modeling._getHandlers();
  }


  static _getHandlers() {
    return {
      'row.add': AddRowHandler,
      'row.remove': RemoveRowHandler,
      'row.move': MoveRowHandler,

      'col.add': AddColHandler,
      'col.remove': RemoveColHandler,
      'col.move': MoveColHandler,

      'cell.edit': EditCellHandler
    };
  }


  _create(type, attrs) {
    if (attrs instanceof Base) {
      return attrs;
    } else {
      return this._elementFactory.create(type, attrs);
    }
  }


  ///////// public API ////////////////////////////

  addRow(attrs, index) {
    const row = this._create('row', attrs);

    const context = {
      row,
      index
    };

    this._commandStack.execute('row.add', context);

    return row;
  }

  removeRow(row) {
    this._commandStack.execute('row.remove', { row });
  }

  moveRow(row, index) {
    const context = {
      row,
      index
    };

    this._commandStack.execute('row.move', context);
  }

  addCol(attrs, index) {
    const col = this._create('col', attrs);

    const context = {
      col,
      index
    };

    this._commandStack.execute('col.add', context);

    return col;
  }

  removeCol(col) {
    this._commandStack.execute('col.remove', { col });
  }

  moveCol(col, index) {
    const context = {
      col,
      index
    };

    this._commandStack.execute('col.move', context);
  }

  editCell(cell, changedAttrs) {
    const context = {
      cell,
      ...changedAttrs
    };

    this._commandStack.execute('cell.edit', context);
  }

}

Modeling.$inject = [
  'eventBus',
  'elementFactory',
  'commandStack'
];


////////// helpers //////////


/**
 * Register handlers with the command stack
 *
 * @param {Object} handlers { id -> Handler } map
 * @param {CommandStack} commandStack
 */
function registerHandlers(handlers, commandStack) {
  forEach(handlers, function(handler, id) {
    commandStack.registerHandler(id, handler);
  });
}
