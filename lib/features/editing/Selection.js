'use strict';

var isArray = require('lodash/lang/isArray'),
    forEach = require('lodash/collection/forEach');


/**
 * A service that offers the current selection in a table.
 * Offers the api to control the selection, too.
 *
 * @class
 *
 * @param {EventBus} eventBus the event bus
 */
function Selection(eventBus) {

  this._eventBus = eventBus;

  this._selectedElement = null;
}

Selection.$inject = [ 'eventBus' ];

module.exports = Selection;


Selection.prototype.deselect = function() {
  if (this._selectedElement) {
    var oldSelection = this._selectedElement;

    this._selectedElement = null;

    this._eventBus.fire('selection.changed', { oldSelection: oldSelection, newSelection: this._selectedElement });
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
  if(this.isSelected(element)) {
    return;
  }

  var oldSelection = this._selectedElement;

  this._selectedElement = element;

  this._eventBus.fire('selection.changed', { oldSelection: oldSelection, newSelection: this._selectedElement });
};
