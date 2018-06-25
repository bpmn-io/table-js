import { isString } from 'min-dash';


/**
 * Allows selecting a table cell. Selected cell will be highlighted.
 */
export default class Selection {

  constructor(elementRegistry, eventBus, renderer) {
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._renderer = renderer;

    this._selection = undefined;

    eventBus.on('diagram.clear', () => {
      this._selection = undefined;
    });
  }

  /**
   * Select a table cell.
   *
   * @param {Object|String} element - Element or element ID.
   */
  select(element) {

    if (isString(element)) {
      element = this._elementRegistry.get(element);
    }

    const oldSelection = this._selection;

    // don't re-select already selected *Ggg*
    if (oldSelection === element) {
      return;
    }

    this._selection = element;

    this._eventBus.fire('selection.changed', {
      oldSelection,
      selection: element
    });
  }

  /**
   * Deselect a table cell.
   */
  deselect() {

    const oldSelection = this._selection;

    this._selection = undefined;

    this._eventBus.fire('selection.changed', {
      oldSelection,
      selection: this._selection
    });

  }

  /**
   * Get the selected cell.
   */
  get() {
    return this._selection;
  }

  /**
   * Check if a cell is selected.
   */
  hasSelection() {
    return !!this._selection;
  }
}

Selection.$inject = [
  'elementRegistry',
  'eventBus',
  'renderer'
];