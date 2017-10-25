
/**
 * A handler that implements row addition.
 */
export default class AddRowHandler {

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
      row,
      index
    } = context;

    if (typeof index === 'undefined') {
      index = context.index = root.rows.length;
    }

    context.newRoot = root;

    if (!row.cells.length) {
      root.cols.forEach((col, idx) => {
        const cell = elementFactory.create('cell', { row, col });

        row.cells[idx] = cell;
      });
    }

    sheet.addRow(row, index);

    return sheet.getRoot();
  }


  /**
   * <undo>
   */
  revert(context) {

    const {
      row
    } = context;

    const sheet = this._sheet;

    sheet.removeRow(row);

    return sheet.getRoot();
  }

}

AddRowHandler.$inject = [
  'sheet',
  'elementFactory'
];