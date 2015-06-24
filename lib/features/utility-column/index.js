module.exports = {
  __init__: [ 'utilityColumn', 'utilityColumnRules' ],
  __depends__: [
    require('diagram-js/lib/features/rules')
  ],
  utilityColumn: [ 'type', require('./UtilityColumn') ],
  utilityColumnRules: [ 'type', require('./UtilityColumnRules') ]
};
