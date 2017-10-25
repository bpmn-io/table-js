export default class ElementRegistry {
  constructor(eventBus) {
    this._eventBus = eventBus;

    this._elements = {};
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
    return Object.values(this._elements);
  }

  forEach(fn) {
    Object.values(this._elements).forEach(element => fn(element));
  }

  filter(fn) {
    return Object.values(this._elements).filter(element => fn(element));
  }
}