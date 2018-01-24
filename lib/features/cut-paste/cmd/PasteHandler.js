import { Row, Col } from '../../../model';

/**
 * A handler that implements pasting an element.
 */
export default class PasteHandler {

  constructor(clipBoard, modeling, sheet) {
    this._clipBoard = clipBoard;
    this._modeling = modeling;
    this._sheet = sheet;
  }


  /**
   * <do>
   */
  postExecute(context) {
    let {
      element,
      after
    } = context;

    if (!this._clipBoard.hasElement()) {
      return;
    }

    const root = this._sheet.getRoot();

    if (element instanceof Row) {
      let index = root.rows.indexOf(element);

      if (index === -1) {
        return;
      }

      if (after) {
        index++;
      }

      this._modeling.addRow(this._clipBoard.getElement(), index);
    } else if (element instanceof Col) {
      let index = root.cols.indexOf(element);

      if (index === -1) {
        return;
      }

      if (after) {
        index++;
      }

      this._modeling.addCol(this._clipBoard.getElement(), index);
    }

    context.oldElement = this._clipBoard.getElement();

    this._clipBoard.clear();

    return this._sheet.getRoot();
  }

  /**
   * <undo>
   */
  revert(context) {

    const {
      oldElement
    } = context;

    this._clipBoard.setElement(oldElement);

    return this._sheet.getRoot();
  }

}

PasteHandler.$inject = [ 'clipBoard', 'modeling', 'sheet' ];