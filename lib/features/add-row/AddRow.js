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

  // add the row control row
  eventBus.on('utilityColumn.added', function(column) {
    var r = sheet.addRow({
      id: 'tjs-controls',
      isFoot: true
    });

    var node = domify('<a title="Add row" class="icon-dmn icon-plus"></a>');

    node.addEventListener('mouseup', function() {
      modeling.createRow({ id: ids.next() });
    });

    sheet.setCellContent({
      row: r,
      column: column,
      content: node
    });

  });
}

AddRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling' ];

module.exports = AddRow;
