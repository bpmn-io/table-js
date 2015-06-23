module.exports = {
  __init__: [ 'addRow'],
  __depends__: [
    require('../modeling')
  ],
  addRow: [ 'type', require('./AddRow') ]
};
