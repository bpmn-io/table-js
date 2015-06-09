module.exports = {
  __depends__: [ require('../draw') ],
  __init__: [ 'sheet' ],
  sheet: [ 'type', require('./Sheet') ],
  elementRegistry: [ 'type', require('./ElementRegistry') ],
/*  elementFactory: [ 'type', require('./ElementFactory') ], */
  eventBus: [ 'type', require('./EventBus') ],
  graphicsFactory: [ 'type', require('./GraphicsFactory') ]
};
