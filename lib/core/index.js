import ElementFactory from './ElementFactory';
import ElementRegistry from './ElementRegistry';
import EventBus from 'diagram-js/lib/core/EventBus';
import Sheet from './Sheet';

export default {
  __init__: [ 'elementFactory', 'sheet' ],
  elementFactory: [ 'type', ElementFactory ],
  elementRegistry: [ 'type', ElementRegistry ],
  eventBus: [ 'type', EventBus ],
  sheet: [ 'type', Sheet ]
};