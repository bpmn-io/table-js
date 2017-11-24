export default class Sheet {
  constructor(elementRegistry, eventBus) {
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;

    this._root = null;

    eventBus.on('table.clear', () => {
      this.setRoot(null);
    });
  }

  setRoot(root) {
    if (this._root) {
      const oldRoot = this._root;

      this._eventBus.fire('root.remove', { root: oldRoot });

      this._root = null;

      this._eventBus.fire('root.removed', { root: oldRoot });
    }

    if (root) {
      this._eventBus.fire('root.add', { root });
    }

    this._root = root;

    if (root) {
      this._eventBus.fire('root.added', { root });
    }
  }

  getRoot() {
    if (!this._root) {
      this.setRoot({
        id: '__implicitroot',
        rows: [],
        cols: []
      });
    }

    return this._root;
  }


  /**
   * Add row to sheet.
   *
   * @param {Object} row - Row.
   */
  addRow(row, index) {
    const root = this.getRoot();

    if (root.cols.length != row.cells.length) {
      throw new Error('number of cells is not equal to number of cols');
    }

    if (typeof index === 'undefined') {
      index = root.rows.length;
    }

    addAtIndex(index, root.rows, row);
    row.root = root;

    this._elementRegistry.add(row);

    row.cells.forEach((cell, idx) => {
      this._elementRegistry.add(cell);

      cell.row = row;
      cell.col = root.cols[idx];

      addAtIndex(index, root.cols[idx].cells, cell);
    });

    this._eventBus.fire('row.add', { row });
    
    return row;
  }


  /**
   * Remove row from sheet.
   *
   * @param {Object|string} row - Row or row ID.
   */
  removeRow(row) {
    const root = this.getRoot();

    if (typeof row === 'string') {
      row = this._elementRegistry.get(row);
    }

    const index = root.rows.indexOf(row);

    if (index === -1) {
      return;
    }

    removeAtIndex(index, root.rows);
    row.root = undefined;

    this._elementRegistry.remove(row);

    row.cells.forEach((cell, idx) => {
      this._elementRegistry.remove(cell);

      cell.col = undefined;

      removeAtIndex(index, root.cols[idx].cells);
    });

    this._eventBus.fire('row.remove', { row });
  }

  /**
   * Add col to sheet.
   *
   * @param {Object} col
   * @param {Number} [index]
   */
  addCol(col, index) {
    const root = this.getRoot();

    this._elementRegistry.add(col);

    if (root.rows.length != col.cells.length) {
      throw new Error('number of cells is not equal to number of rows');
    }

    if (typeof index === 'undefined') {
      index = root.cols.length;
    }

    addAtIndex(index, root.cols, col);
    col.root = root;

    col.cells.forEach((cell, idx) => {
      this._elementRegistry.add(cell);

      cell.col = col;
      cell.row = root.rows[idx];

      addAtIndex(index, root.rows[idx].cells, cell);
    });

    this._eventBus.fire('col.add', { col });

    return col;
  }

  /**
   * Remove col from sheet.
   *
   * @param {Object|string} col - Col or col ID.
   */
  removeCol(col) {

    const root = this.getRoot();
    
    if (typeof col === 'string') {
      col = this._elementRegistry.get(col);
    }

    const index = root.cols.indexOf(col);

    if (index === -1) {
      return;
    }

    removeAtIndex(index, root.cols);
    col.root = undefined;

    this._elementRegistry.remove(col);

    col.cells.forEach((cell, idx) => {
      this._elementRegistry.remove(cell);

      cell.row = undefined;
      
      removeAtIndex(index, root.rows[idx].cells);
    });

    this._eventBus.fire('col.remove', { col });
  }

}

Sheet.$inject = [ 'elementRegistry', 'eventBus' ];


////////// helpers //////////

/**
 * Insert value
 * 
 * @param {number} index - Index to insert value at.
 * @param {Array} array - Array to insert value into.
 * @param {*} value - Value to insert.
 */
function addAtIndex(index, array, value) {
  return array.splice(index, 0, value);
}

/**
 * 
 * @param {number} index - Index to remove.
 * @param {Array} array - Array to remove from.
 */
function removeAtIndex(index, array) {
  return array.splice(index, 1);
}