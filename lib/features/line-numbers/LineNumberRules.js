'use strict';

var inherits = require('inherits');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * LineNumber specific modeling rule
 */
function LineNumberRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(LineNumberRules, RuleProvider);

LineNumberRules.$inject = [ 'eventBus' ];

module.exports = LineNumberRules;

LineNumberRules.prototype.init = function() {

  this.addRule('cell.edit', function(context) {
    return context.column.id !== 'lineNumbers';
  });

};
