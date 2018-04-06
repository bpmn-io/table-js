/**
 * Selects table cells on on left & right click.
 */
export default class SelectionBehavior {

  constructor(elementRegistry, eventBus, renderer, selection) {
    this._elementRegistry = elementRegistry;
    this._renderer = renderer;
    this._selection = selection;

    eventBus.on([ 'cell.click', 'cell.contextmenu'], ({ id }) => {
      const element = elementRegistry.get(id);

      if (!element) {
        return;
      }

      selection.select(element);
    });

    eventBus.on('row.remove', ({ row }) => {
      const currentSelection = selection.get();

      if (!currentSelection) {
        return;
      }

      if (row === currentSelection.row) {
        selection.deselect();
      }
    });

    eventBus.on('col.remove', ({ col }) => {
      const currentSelection = selection.get();

      if (!currentSelection) {
        return;
      }

      if (col === currentSelection.col) {
        selection.deselect();
      }
    });
  }

}

SelectionBehavior.$inject = [
  'elementRegistry',
  'eventBus',
  'renderer',
  'selection'
];