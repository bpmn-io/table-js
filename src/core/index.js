import ElementFactory from './ElementFactory';
import ElementRegistry from './ElementRegistry';
import EventBus from 'diagram-js/lib/core/EventBus';
import renderModule from '../render';
import Sheet from './Sheet';
import Throttle from './Throttle';

export default {
  __depends__: [ renderModule ],
  __init__: [ 'elementFactory', 'sheet' ],
  elementFactory: [ 'type', ElementFactory ],
  elementRegistry: [ 'type', ElementRegistry ],
  eventBus: [ 'type', EventBus ],
  sheet: [ 'type', Sheet ],
  throttle: [ 'factory', Throttle ]
};