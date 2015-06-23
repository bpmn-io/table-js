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
  eventBus.on('import.success', function(event) {
    var r = sheet.addRow({
      id: 'tjs-controls',
      isFoot: true
    });
    var cells = elementRegistry.filter(function(el) {
      return el._type === 'cell' && el.row === r;
    });

    var node = domify('<a title="Add row" class="icon-dmn icon-plus"></a>');

    node.addEventListener('click', function() {
      modeling.createRow({ id: ids.next() });
    });

    sheet.setCellContent({
      row: r,
      column: cells[0].column,
      content: node
    });

  });
}

AddRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling' ];

module.exports = AddRow;
