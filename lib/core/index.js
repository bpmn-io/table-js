module.exports = {
  __depends__: [ require('../draw') ],
  __init__: [ 'sheet' ],
  sheet: [ 'type', require('./Sheet') ],
  elementRegistry: [ 'type', require('./ElementRegistry') ],
  graphicsFactory: [ 'type', require('./GraphicsFactory') ],
  eventBus: [ 'type', require('diagram-js/lib/core/EventBus') ]
};
