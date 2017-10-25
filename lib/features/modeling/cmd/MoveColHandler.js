
/**
 * A handler that implements col movement.
 */
export default class MoveColHandler {
  
  constructor(modeling) {
    this._modeling = modeling;
  }

  /**
   * <preexecute>
   */
  preExecute(context) {
    let {
      col
    } = context;

    this._modeling.removeCol(col);
  }

  /**
   * <postexecute>
   */
  postExecute(context) {
    let {
      col,
      index
    } = context;

    this._modeling.addCol(col, index);
  }

}

MoveColHandler.$inject = [ 'modeling' ];