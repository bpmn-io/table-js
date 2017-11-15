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
  
  constructor(config, eventBus) {
    this._config = config;
    this._eventBus = eventBus;

    this._handleEvent = this._handleEvent.bind(this);

    this._addEventListeners(EVENTS);

    eventBus.on('diagram.destroy', () => {
      this._removeEventListeners(EVENTS);
    });

    // eventBus.on(EVENTS.map(e => `cell.${e}`), e => console.log(e));
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

    const node = target.closest('th') || target.closest('td');

    if (!node) {
      this._eventBus.fire(`other.${type}`, {
        event
      });
      
      return;
    }

    const { id } = node;
    
    if (node && id) {
      this._eventBus.fire(`cell.${type}`, {
        id,
        event,
        node
      });
    } else {
      this._eventBus.fire(`other.${type}`, {
        event
      });
    }
  }

}

InteractionEvents.$inject = [ 'config', 'eventBus' ];