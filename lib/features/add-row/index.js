module.exports = {
  __init__: [ 'addRow', 'addRowRenderer'],
  __depends__: [
    require('../modeling'),
    require('../utility-column')
  ],
  addRow: [ 'type', require('./AddRow') ],
  addRowRenderer: [ 'type', require('./AddRowRenderer') ]
};
