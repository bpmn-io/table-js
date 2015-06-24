module.exports = {
  __init__: [ 'lineNumbers', 'lineNumberRules' ],
  __depends__: [
    require('diagram-js/lib/features/rules')
  ],
  lineNumbers: [ 'type', require('./LineNumbers') ],
  lineNumberRules: ['type', require('./LineNumberRules') ]
};
