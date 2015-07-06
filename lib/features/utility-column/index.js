module.exports = {
  __init__: [ 'utilityColumn', 'utilityColumnRules', 'utilityColumnRenderer' ],
  __depends__: [
    require('diagram-js/lib/features/rules')
  ],
  utilityColumn: [ 'type', require('./UtilityColumn') ],
  utilityColumnRules: [ 'type', require('./UtilityColumnRules') ],
  utilityColumnRenderer: [ 'type', require('./UtilityColumnRenderer') ]
};
