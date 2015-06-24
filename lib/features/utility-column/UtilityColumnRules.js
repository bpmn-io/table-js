'use strict';

var inherits = require('inherits');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * LineNumber specific modeling rule
 */
function UtilityColumnRules(eventBus, utilityColumn) {
  RuleProvider.call(this, eventBus);

  this._utilityColumn = utilityColumn;
}

inherits(UtilityColumnRules, RuleProvider);

UtilityColumnRules.$inject = [ 'eventBus', 'utilityColumn' ];

module.exports = UtilityColumnRules;

UtilityColumnRules.prototype.init = function() {
  var self = this;
  this.addRule('cell.edit', function(context) {
    return context.column !== self._utilityColumn.getColumn();
  });

};
