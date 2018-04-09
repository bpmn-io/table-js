import {
  closest as domClosest
} from 'min-dom';

const EVENTS = [
  'click',
  'dblclick',
  'contextmenu',
  'mousedown',
  'mouseup',
  'mouseenter',
  'mouseleave',
  'mouseout',
  'mouseover',
  'mousemove',
  'focusin',
  'focusout',
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'drop'
];


/**
 * Provides interaction events on the table.
 *
 * @param {RenderConfig} config
 * @param {EventBus} eventBus
 */
export default class InteractionEvents {

  constructor(config, eventBus) {
    this._eventBus = eventBus;
    this._container = config.container;

    eventBus.on('table.init', () => {
      this._addEventListeners(EVENTS);
    });

    eventBus.on('table.destroy', () => {
      this._removeEventListeners(EVENTS);
    });
  }

  _addEventListeners(events) {
    const container = this._container;

    events.forEach(event => {
      container.addEventListener(event, this._handleEvent);
    });
  }

  _removeEventListeners(events) {
    const container = this._container;

    events.forEach(event => {
      container.removeEventListener(event, this._handleEvent);
    });
  }

  _handleEvent = (event) => {
    const { target, type } = event;

    const node = findClosestCell(target);

    if (!node) {
      return;
    }

    const elementId = node.getAttribute('data-element-id');

    if (elementId) {
      const e = this._eventBus.createEvent({
        id: elementId,
        event,
        node,
        target: node
      });

      this._eventBus.fire(`cell.${type}`, e);

      if (e.defaultPrevented) {
        event.preventDefault();
      }

      if (e.cancelBubble) {
        event.stopPropagation();
      }
    }
  }
}

InteractionEvents.$inject = [
  'config.renderer',
  'eventBus'
];

// helpers /////////////

function findClosestCell(element) {
  return domClosest(element, '[data-element-id]', true);
}