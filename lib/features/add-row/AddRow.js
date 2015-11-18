'use strict';

var domify = require('min-dom/lib/domify');

// document wide unique overlay ids
var ids = new (require('diagram-js/lib/util/IdGenerator'))('row');

/**
 * Adds a control to the table to add more rows
 *
 * @param {EventBus} eventBus
 */
function AddRow(eventBus, sheet, elementRegistry, modeling) {

  this.row = null;

  var self = this;
  // add the row control row
  eventBus.on('utilityColumn.added', function(event) {
    var column = event.column;
    self.row = sheet.addRow({
      id: 'tjs-controls',
      isFoot: true
    });

    var node = domify('<a title="Add row" class="icon-dmn dmn-icon-plus"></a>');

    node.addEventListener('mouseup', function() {
      modeling.createRow({ id: ids.next() });
    });

    sheet.setCellContent({
      row: self.row,
      column: column,
      content: node
    });

  });
}

AddRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling' ];

module.exports = AddRow;

AddRow.prototype.getRow = function() {
  return this.row;
};
