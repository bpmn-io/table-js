'use strict';

/**
 * A service that offers the current selection in a table.
 * Offers the api to control the selection, too.
 *
 * @class
 *
 * @param {EventBus} eventBus the event bus
 */
function Selection(eventBus, elementRegistry) {

  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;

  this._selectedElement = null;
}

Selection.$inject = [ 'eventBus', 'elementRegistry' ];

module.exports = Selection;


Selection.prototype.deselect = function(skipEvent) {
  if (this._selectedElement) {
    var oldSelection = this._selectedElement;

    this._selectedElement.row.selected = false;
    this._selectedElement.column.selected = false;
    this._selectedElement.selected = false;
    this._selectedElement = null;
    if (!skipEvent) {
      this._eventBus.fire('selection.changed', { oldSelection: oldSelection, newSelection: this._selectedElement });
    }
    return oldSelection;
  }
};


Selection.prototype.get = function() {
  return this._selectedElement;
};

Selection.prototype.isSelected = function(element) {
  return this._selectedElement === element;
};


/**
 * This method selects a cell in the table.
 *
 * @method Selection#select
 *
 * @param  {Object} element element to be selected
 */
Selection.prototype.select = function(element) {
  if (!element || this.isSelected(element)) {
    return;
  }

  var oldSelection = this._selectedElement;

  if (oldSelection) {
    this.deselect(true);
  }

  this._selectedElement = element;
  element.selected = true;
  element.row.selected = true;
  element.column.selected = true;

  this._eventBus.fire('selection.changed', { oldSelection: oldSelection, newSelection: this._selectedElement });
};

/**
 * This method selects the cell above the currently selected cell
 *
 * @method Selection#selectAbove
 */
Selection.prototype.selectAbove = function() {
  var node = this.get();
  if(node && node.row && node.row.previous) {
    var cell = this._elementRegistry.filter(function(element) {
      return element.row && element.row === node.row.previous &&
         element.column && element.column === node.column;
    })[0];
    this.select(cell);
    this._elementRegistry.getGraphics(cell.id).firstChild.focus();
  }
};

/**
 * This method selects the cell below the currently selected cell
 *
 * @method Selection#selectBelow
 */
Selection.prototype.selectBelow = function() {
  var node = this.get();
  if(node && node.row && node.row.next) {
    var cell = this._elementRegistry.filter(function(element) {
      return element.row && element.row === node.row.next &&
         element.column && element.column === node.column;
    })[0];
    this.select(cell);
    this._elementRegistry.getGraphics(cell.id).firstChild.focus();
  }
};
