import { Row, Col } from '../../../model';

/**
 * A handler that implements cutting an element.
 */
export default class CutHandler {

  constructor(clipBoard, modeling, sheet) {
    this._clipBoard = clipBoard;
    this._modeling = modeling;
    this._sheet = sheet;
  }


  /**
   * <do>
   */
  execute(context) {
    let {
      element
    } = context;

    context.oldElement = this._clipBoard.getElement();

    this._clipBoard.setElement(element);

    return this._sheet.getRoot();
  }

  postExecute(context) {
    let {
      element
    } = context;

    if (element instanceof Row) {
      this._modeling.removeRow(element);
    } else if (element instanceof Col) {
      this._modeling.removeCol(element);
    }
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

CutHandler.$inject = [ 'clipBoard', 'modeling', 'sheet' ];