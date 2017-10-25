
/**
 * A handler that implements cell editing.
 *
 * Per default, this handler does nothing.
 * Interested parties may hook into the edit commands
 * `preExecute` or `postExecute` phases to carry out
 * the actual editing.
 */
export default class EditCellHandler {

  /**
   * <do>
   */
  execute(context) {

    let {
      cell
    } = context;

    return cell;
  }

  /**
   * <undo>
   */
  revert(context) {

    const {
      cell
    } = context;

    return cell;
  }

}