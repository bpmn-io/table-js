module.exports = {
  __init__: [ 'lineNumbers' ],
  __depends__: [
    require('../utility-column')
  ],
  lineNumbers: [ 'type', require('./LineNumbers') ]
};
