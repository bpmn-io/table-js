import isString from 'lodash/isString';


/**
 * Allows selecting a table cell. Selected cell will be highlighted.
 */
export default class Selection {

  constructor(elementRegistry, eventBus) {
    this._elementRegistry = elementRegistry;

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
   * @param {String} nodeId - Node ID.
   */
  select(element, nodeId) {
    if (!this._isFrozen) {
      if (this._selection) {
        this.deselect();
      }

      if (isString(element)) {
        element = this._elementRegistry.get(element);
      }
  
      this._selection = element;

      const node = document.querySelector(`[data-element-id="${element.id}"`);

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
      const node = document.querySelector(`[data-element-id="${this._selection.id}"`);
      
      if (node) {
        node.classList.remove('selected');
      }
      
      this._selection = undefined;
    }
  }

  /**
   * Get the selected cell.
   */
  get() {
    return this._selection;
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

Selection.$inject = [ 'elementRegistry', 'eventBus' ];