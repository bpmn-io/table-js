module.exports = {
  __init__: [ 'rowDrag', 'dragRenderer' ],
  __depends__: [
    require('../utility-column')
  ],
  rowDrag: [ 'type', require('./RowDrag') ],
  dragRenderer: [ 'type', require('./DragRenderer') ]
};
