'use strict';

var domClasses = require('min-dom/lib/classes');

function DragRenderer(
    eventBus,
    utilityColumn) {

  eventBus.on('cell.render', function(event) {
    if (event.data.column === utilityColumn.getColumn() && !event.data.row.isFoot && !event.data.row.isHead) {
      domClasses(event.gfx).add('draggable');
    }
  });
}

DragRenderer.$inject = [
  'eventBus',
  'utilityColumn'
];

module.exports = DragRenderer;
