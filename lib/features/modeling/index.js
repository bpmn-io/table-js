module.exports = {
  __depends__: [
    require('diagram-js/lib/command'),
    require('../change-support'),
    require('diagram-js/lib/features/rules')
  ],
  __init__: [ 'modeling' ],
  modeling: [ 'type', require('./Modeling') ]
};
