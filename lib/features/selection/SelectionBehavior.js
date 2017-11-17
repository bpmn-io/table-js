export default class SelectionBehavior {
  constructor(config, elementRegistry, eventBus, selection) {
    this._config = config;
    this._selection = selection;

    this._onClick = this._onClick.bind(this);

    eventBus.on([ 'cell.click', 'cell.contextmenu'], ({ id }) => {
      const element = elementRegistry.get(id);

      if (!element) {
        return;
      }
      
      selection.select(element);

      window.addEventListener('click', this._onClick);
    });

    eventBus.on('row.remove', ({ row }) => {
      const currentSelection = selection.get();
      
      if (!currentSelection) {
        return;
      }
      
      if (row === currentSelection.row) {
        selection.unfreeze();

        selection.deselect();
      }
    });

    eventBus.on('col.remove', ({ col }) => {
      const currentSelection = selection.get();

      if (!currentSelection) {
        return;
      }
      
      if (col === currentSelection.col) {
        selection.unfreeze();

        selection.deselect();
      }
    });
  }

  _onClick(event) {
    const { target } = event;

    if (!this._config.container.contains(target) && !target.closest('td') && !target.closest('th')) {
      this._selection.deselect();
    }

    window.removeEventListener('click', this._onClick);
  }
}

SelectionBehavior.$inject = [ 'config', 'elementRegistry', 'eventBus', 'selection' ];