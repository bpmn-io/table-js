import { closest as domClosest } from 'min-dom';

const EVENTS = [
  'click',
  'dblclick',
  'contextmenu',
  'mousedown',
  'mouseup',
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

    const node =
      domClosest(target, 'th') ||
      target.tagName === 'TH' ? target : false ||
      domClosest(target, 'td') ||
      target.tagName === 'TD' ? target : false;

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