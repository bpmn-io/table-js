import ElementFactory from './ElementFactory.js';
import ElementRegistry from './ElementRegistry.js';
import EventBus from 'diagram-js/lib/core/EventBus.js';
import renderModule from '../render/index.js';
import Sheet from './Sheet.js';
import Throttle from './Throttle.js';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __depends__: [ renderModule ],
  __init__: [ 'elementFactory', 'sheet' ],
  elementFactory: [ 'type', ElementFactory ],
  elementRegistry: [ 'type', ElementRegistry ],
  eventBus: [ 'type', EventBus ],
  sheet: [ 'type', Sheet ],
  throttle: [ 'factory', Throttle ]
};