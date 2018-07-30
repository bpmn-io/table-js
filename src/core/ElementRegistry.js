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

  updateId(element, newId) {

    this._validateId(newId);

    if (typeof element === 'string') {
      element = this.get(element);
    }

    this._eventBus.fire('element.updateId', {
      element: element,
      newId: newId
    });

    this.remove(element);

    element.id = newId;

    this.add(element);
  }

  /**
 * Validate the suitability of the given id and signals a problem
 * with an exception.
 *
 * @param {String} id
 *
 * @throws {Error} if id is empty or already assigned
 */
  _validateId(id) {
    if (!id) {
      throw new Error('element must have an id');
    }

    if (this._elements[id]) {
      throw new Error('element with id ' + id + ' already added');
    }
  }
}

ElementRegistry.$inject = [ 'eventBus' ];


// helpers

function values(obj) {
  return Object.keys(obj).map(function(k) {
    return obj[k];
  });
}