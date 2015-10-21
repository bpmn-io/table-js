'use strict';

var domClasses = require('min-dom/lib/classes');

function UtilityColumnRenderer(
    eventBus,
    utilityColumn) {

  eventBus.on('cell.render', function(event) {
    if (event.data.column === utilityColumn.getColumn() && !event.data.row.isFoot) {
      event.gfx.childNodes[0].textContent = event.data.content;
      domClasses(event.gfx).add(event.data.row.isHead ? 'hit' : 'number');
    }
  });
}

UtilityColumnRenderer.$inject = [
  'eventBus',
  'utilityColumn'
];

module.exports = UtilityColumnRenderer;
