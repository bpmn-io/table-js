'use strict';

/**
 * Adds a dedicated column to the table dedicated to hold controls and meta information
 *
 * @param {EventBus} eventBus
 */
function UtilityColumn(eventBus, sheet) {

  // add the row control row
  this.column = null;
  var self = this;
  eventBus.on('sheet.init', function(event) {

    eventBus.fire('utilityColumn.add', event);

    self.column = sheet.addColumn({
      id: 'utilityColumn'
    });

    eventBus.fire('utilityColumn.added', self.column);
  });
  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('utilityColumn.destroy', self.column);

    sheet.removeColumn({
      id: 'utilityColumn'
    });

    eventBus.fire('utilityColumn.destroyed', self.column);
  });
}

UtilityColumn.$inject = [ 'eventBus', 'sheet' ];

module.exports = UtilityColumn;


UtilityColumn.prototype.getColumn = function() {
  return this.column;
};
