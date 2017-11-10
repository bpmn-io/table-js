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

    // bind in order to be able to remove event listener later
    this._handleEvent = this._handleEvent.bind(this);

    this._addEventListeners(EVENTS);

    eventBus.on('diagram.destroy', () => {
      this._removeEventListeners(EVENTS);
    });

    // eventBus.on(EVENTS.map(e => `cell.${e}`), e => console.log(e));
  }

  _addEventListeners(events) {
    const container = this._config.container || document.body;

    events.forEach(event => {
      container.addEventListener(event, this._handleEvent);
    });
  }

  _removeEventListeners(events) {
    const container = this._config.container || document.body;
    
    events.forEach(event => {
      container.removeEventListener(event, this._handleEvent);
    });
  }

  _handleEvent(event) {
    const { target, type } = event;

    const node = target.closest('th') || target.closest('td');

    if (!node) {
      return;
    }

    const { id } = node;
    
    if (node && id) {
      this._eventBus.fire(`cell.${type}`, {
        id,
        event,
        node
      });
    }
  }

}

InteractionEvents.$inject = [ 'config', 'eventBus' ];