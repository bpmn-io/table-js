
/**
 * A handler that implements column deletion.
 */
export default class RemoveColHandler {

  constructor(sheet, elementFactory) {
    this._sheet = sheet;
    this._elementFactory = elementFactory;
  }

  /**
   * <do>
   */
  execute(context) {

    const sheet = this._sheet;

    let {
      col
    } = context;

    const root = context.oldRoot = col.root;

    // retrieve and remember previous col position
    const oldIndex = context.oldIndex = root.cols.indexOf(col);

    if (oldIndex === -1) {
      throw new Error(`col#${col.id} not in sheet`);
    }

    sheet.removeCol(col);

    return sheet.getRoot();
  }


  /**
   * <undo>
   */
  revert(context) {

    const {
      col,
      oldIndex
    } = context;

    const sheet = this._sheet;

    sheet.addCol(col, oldIndex);

    return sheet.getRoot();
  }

}


RemoveColHandler.$inject = [
  'sheet'
];