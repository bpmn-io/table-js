module.exports = {
  __depends__: [ require('../draw') ],
  __init__: [ 'sheet' ],
  sheet: [ 'type', require('./Sheet') ],
  elementRegistry: [ 'type', require('./ElementRegistry') ],
  elementFactory: ['type', require('./ElementFactory')],
  graphicsFactory: [ 'type', require('./GraphicsFactory') ],
  eventBus: [ 'type', require('diagram-js/lib/core/EventBus') ]
};
