export default class Clipboard {
  constructor() {
    this._element = undefined;
  }

  setElement(element) {
    this._element = element;
  }

  getElement() {
    return this._element;
  }

  hasElement() {
    return !!this._element;
  }

  clear() {
    this._element = undefined;
  }
}