import { closest as domClosest } from 'min-dom';

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
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'drop'
];

export default class InteractionEvents {

  constructor(eventBus) {
    this._eventBus = eventBus;

    this._handleEvent = this._handleEvent.bind(this);

    this._addEventListeners(EVENTS);

    eventBus.on('diagram.destroy', () => {
      this._removeEventListeners(EVENTS);
    });
  }

  _addEventListeners(events) {
    events.forEach(event => {
      window.addEventListener(event, this._handleEvent);
    });
  }

  _removeEventListeners(events) {
    events.forEach(event => {
      window.removeEventListener(event, this._handleEvent);
    });
  }

  _handleEvent(event) {
    const { target, type } = event;

    const node = findClosestCell(target);

    if (!node) {
      return;
    }

    const { elementId } = node.dataset;

    if (elementId) {
      this._eventBus.fire(`cell.${type}`, {
        id: elementId,
        event,
        node
      });
    }
  }

}

InteractionEvents.$inject = [
  'eventBus'
];

////////// helpers //////////

function findClosestCell(element) {
  const closest = domClosest(element, 'th') || domClosest(element, 'td');

  const isCell = (
    element.tagName.toLowerCase() === 'th' ||
    element.tagName.toLowerCase() === 'td'
  );

  if (isCell) {
    return element;
  } else if (closest) {
    return closest;
  }
}