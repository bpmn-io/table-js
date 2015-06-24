module.exports = {
  __init__: [ 'addRow'],
  __depends__: [
    require('../modeling'),
    require('../utility-column')
  ],
  addRow: [ 'type', require('./AddRow') ]
};
