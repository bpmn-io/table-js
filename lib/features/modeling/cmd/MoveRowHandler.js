
/**
 * A handler that implements row movement.
 */
export default class MoveRowHandler {

  constructor(modeling) {
    this._modeling = modeling;
  }

  /**
   * <preexecute>
   */
  preExecute(context) {
    let {
      row
    } = context;

    this._modeling.removeRow(row);
  }

  /**
   * <postexecute>
   */
  postExecute(context) {
    let {
      row,
      index
    } = context;

    this._modeling.addRow(row, index);
  }

}

MoveRowHandler.$inject = [ 'modeling' ];