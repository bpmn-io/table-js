
/**
 * A handler that implements column addition.
 */
export default class AddColHandler {

  constructor(sheet, elementFactory) {
    this._sheet = sheet;
    this._elementFactory = elementFactory;
  }


  /**
   * <do>
   */
  execute(context) {

    const sheet = this._sheet,
          elementFactory = this._elementFactory,
          root = sheet.getRoot();

    let {
      col,
      index
    } = context;

    if (typeof index === 'undefined') {
      index = context.index = root.cols.length;
    }

    context.newRoot = root;

    if (!col.cells.length) {
      root.rows.forEach((row, idx) => {
        const cell = elementFactory.create('cell', { row, col });

        col.cells[idx] = cell;
      });
    }

    sheet.addCol(col, index);

    return sheet.getRoot();
  }


  /**
   * <undo>
   */
  revert(context) {

    const {
      col
    } = context;

    const sheet = this._sheet;

    sheet.removeCol(col);

    return sheet.getRoot();
  }

}

AddColHandler.$inject = [
  'sheet',
  'elementFactory'
];