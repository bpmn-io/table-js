import { create } from '../model';

export default class ElementFactory {
  constructor() {
    this._uid = 12;
  }

  create(type, attrs = {}) {
    if (!attrs.id) {
      attrs.id = type + '_' + (this._uid++);
    }

    return create(type, attrs);
  }

  createRoot(attrs) {
    return this.create('root', attrs);
  }

  createRow(attrs) {
    return this.create('row', attrs);
  }

  createCol(attrs) {
    return this.create('col', attrs);
  }

  createCell(attrs) {
    return this.create('cell', attrs);
  }

}