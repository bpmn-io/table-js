'use strict';

var domClasses = require('min-dom/lib/classes');

function AddRowRenderer(
    eventBus,
    addRow) {

  eventBus.on('cell.render', function(event) {
    if (event.data.row === addRow.getRow() && event.data.content) {
      domClasses(event.gfx).add('add-rule');
      event.gfx.childNodes[0].appendChild(event.data.content);
    }
  });

  eventBus.on('row.render', function(event) {
    if (event.data === addRow.getRow()) {
      domClasses(event.gfx).add('rules-controls');
    }
  });

}

AddRowRenderer.$inject = [
  'eventBus',
  'addRow'
];

module.exports = AddRowRenderer;
