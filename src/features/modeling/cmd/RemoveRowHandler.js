
/**
 * A handler that implements row deletion.
 */
export default class RemoveRowHandler {

  constructor(sheet) {
    this._sheet = sheet;
  }


  /**
   * <do>
   */
  execute(context) {

    const sheet = this._sheet,
          root = sheet.getRoot();

    let {
      row
    } = context;

    // retrieve and remember previous row position
    const oldIndex = context.oldIndex = root.rows.indexOf(row);

    context.oldRoot = row.root;

    if (oldIndex === -1) {
      throw new Error(`row#${row.id} not in sheet`);
    }

    sheet.removeRow(row);

    return sheet.getRoot();
  }


  /**
   * <undo>
   */
  revert(context) {

    const {
      row,
      oldIndex
    } = context;

    const sheet = this._sheet;

    sheet.addRow(row, oldIndex);

    return sheet.getRoot();
  }

}

RemoveRowHandler.$inject = [
  'sheet'
];