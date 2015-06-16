module.exports = {
  __init__: [ 'editBehavior' ],
  __depends__: [
    require('../interaction-events'),
    require('../modeling')
  ],
  selection: [ 'type', require('./Selection') ],
  editBehavior: [ 'type', require('./EditBehavior') ]
};
