module.exports = {
  __init__: [ 'editBehavior', 'editRenderer' ],
  __depends__: [
    require('../interaction-events'),
    require('../modeling'),
    require('../keyboard'),
    require('diagram-js/lib/features/rules')
  ],
  selection: [ 'type', require('./Selection') ],
  editBehavior: [ 'type', require('./EditBehavior') ],
  editRenderer: [ 'type', require('./EditRenderer') ]
};
