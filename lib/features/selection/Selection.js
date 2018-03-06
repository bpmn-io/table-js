import isString from 'lodash/lang/isString';

import { query as domQuery } from 'min-dom';


/**
 * Allows selecting a table cell. Selected cell will be highlighted.
 */
export default class Selection {

  constructor(elementRegistry, eventBus, renderer) {
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._renderer = renderer;

    this._selection = undefined;
    this._isFrozen = false;

    eventBus.on('diagram.clear', () => {
      this._selection = undefined;
      this._isFrozen = false;
    });
  }

  /**
   * Select a table cell.
   *
   * @param {Object|String} element - Element or element ID.
   */
  select(element) {
    if (!this._isFrozen) {
      if (this._selection) {
        this.deselect();
      }

      if (isString(element)) {
        element = this._elementRegistry.get(element);
      }

      const oldSelection = this._selection;

      this._selection = element;

      this._eventBus.fire('selection.changed', {
        oldSelection,
        selection: this._selection
      });

      const container = this._renderer.getContainer();

      const node = domQuery(`[data-element-id="${element.id}"]`, container);

      if (node) {
        node.classList.add('selected');
      }
    }
  }

  /**
   * Deselect a table cell.
   */
  deselect() {
    if (this._selection && !this._isFrozen) {
      const container = this._renderer.getContainer();

      const node = domQuery(`[data-element-id="${this._selection.id}"]`, container);

      if (node) {
        node.classList.remove('selected');
      }

      const oldSelection = this._selection;

      this._selection = undefined;

      this._eventBus.fire('selection.changed', {
        oldSelection,
        selection: this._selection
      });
    }
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

  /**
   * Freeze selection so it can not change.
   */
  freeze() {
    this._isFrozen = true;
  }

  /**
   * Unfreeze selection so it can change.
   */
  unfreeze() {
    this._isFrozen = false;
  }
}

Selection.$inject = [
  'elementRegistry',
  'eventBus',
  'renderer'
];