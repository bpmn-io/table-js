export default class ElementRegistry {
  constructor(eventBus) {
    this._eventBus = eventBus;

    this._elements = {};

    eventBus.on('table.clear', this.clear.bind(this));
  }

  add(element, type) {
    const { id } = element;

    this._elements[id] = element;
  }

  remove(element) {
    const id = element.id || element;

    delete this._elements[id];
  }

  get(id) {
    return this._elements[id];
  }

  getAll() {
    return values(this._elements);
  }

  forEach(fn) {
    values(this._elements).forEach(element => fn(element));
  }

  filter(fn) {
    return values(this._elements).filter(element => fn(element));
  }

  clear() {
    this._elements = {};
  }
}

ElementRegistry.$inject = [ 'eventBus' ];


// helpers

function values(obj) {
  return Object.keys(obj).map(function(k) {
    return obj[k];
  });
}