import assign from 'lodash/assign';


export class Base {

  constructor(attrs) {
    assign(this, attrs);

    /**
     * The object that backs up the shape
     *
     * @name Base#businessObject
     * @type Object
     */
    defineProperty(this, 'businessObject', {
      writable: true
    });
  }

}


export class Root extends Base {

  constructor(attrs) {
    super(attrs);

    /**
     * The tables rows
     *
     * @name Root#rows
     * @type Row
     */
    defineProperty(this, 'rows', {
      enumerable: true,
      value: this.rows || []
    });

    /**
     * The tables columns
     *
     * @name Root#cols
     * @type Col
     */
    defineProperty(this, 'cols', {
      enumerable: true,
      value: this.cols || []
    });
  }

}


export class Row extends Base {

  constructor(attrs) {
    super(attrs);

    /**
     * Reference to the table
     *
     * @name Row#root
     * @type Root
     */
    defineProperty(this, 'root', {
      writable: true
    });

    /**
     * Reference to contained cells
     *
     * @name Row#cells
     * @type Cell
     */
    defineProperty(this, 'cells', {
      enumerable: true,
      value: this.cells || []
    });
  }

}


export class Col extends Base {

  constructor(attrs) {
    super(attrs);

    /**
     * Reference to the table
     *
     * @name Col#table
     * @type Root
     */
    defineProperty(this, 'root', {
      writable: true
    });

    /**
     * Reference to contained cells
     *
     * @name Row#cells
     * @type Cell
     */
    defineProperty(this, 'cells', {
      enumerable: true,
      value: this.cells || []
    });
  }
}


export class Cell extends Base {

  constructor(attrs) {
    super(attrs);

    /**
     * Reference to the row
     *
     * @name Cell#row
     * @type Row
     */
    defineProperty(this, 'row', {
      writable: true
    });

    /**
     * Reference to the col
     *
     * @name Cell#col
     * @type Col
     */
    defineProperty(this, 'col', {
      writable: true
    });
  }

}


const TYPES = {
  root: Root,
  row: Row,
  col: Col,
  cell: Cell
};


export function create(type, attrs) {
  const Type = TYPES[type];

  if (!Type) {
    throw new Error('unknown type ' + type);
  }

  return new Type(attrs);
}


// helpers /////////////

function defineProperty(el, prop, options) {
  Object.defineProperty(el, prop, options);
}