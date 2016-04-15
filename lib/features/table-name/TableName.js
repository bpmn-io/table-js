'use strict';

var domify = require('min-dom/lib/domify');

/**
 * Adds a header to the table containing the table name
 *
 * @param {EventBus} eventBus
 */
function TableName(eventBus, sheet, tableName) {

  this.tableName = tableName;

  this.node = domify('<header><h3 class="tjs-table-name">'+this.tableName+'</h3></header>');

  var self = this;
  eventBus.on('sheet.init', function(event) {
    sheet.getContainer().insertBefore(self.node, sheet.getRootElement());
    eventBus.fire('tableName.init', {node: self.node.querySelector('h3')});
  });
  eventBus.on('sheet.destroy', function(event) {
    sheet.getContainer().removeChild(self.node);
    eventBus.fire('tableName.destroy', {node: self.node.querySelector('h3')});
  });
}

TableName.$inject = [ 'eventBus', 'sheet', 'config.tableName' ];

module.exports = TableName;

TableName.prototype.setName = function(newName) {
  this.tableName = newName;
  this.node.querySelector('h3').textContent = newName;
};

TableName.prototype.getName = function() {
  return this.tableName;
};

TableName.prototype.getNode = function() {
  return this.node.querySelector('h3');
};
