module.exports = {
  __init__: [ 'rowDrag' ],
  __depends__: [
    require('../utility-column')
  ],
  rowDrag: [ 'type', require('./RowDrag') ]
};
