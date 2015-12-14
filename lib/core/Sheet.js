'use strict';

var isNumber = require('lodash/lang/isNumber'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach'),
    every = require('lodash/collection/every');

function ensurePx(number) {
  return isNumber(number) ? number + 'px' : number;
}

/**
 * Creates a HTML container element for a table element with
 * the given configuration
 *
 * @param  {Object} options
 * @return {HTMLElement} the container element
 */
function createContainer(options) {

  options = assign({}, { width: '100%', height: '100%' }, options);

  var container = options.container || document.body;

  // create a <div> around the table element with the respective size
  // this way we can always get the correct container size
  var parent = document.createElement('div');
  parent.setAttribute('class', 'tjs-container');

  assign(parent.style, {
    position: 'relative',
    overflow: 'hidden',
    width: ensurePx(options.width),
    height: ensurePx(options.height)
  });

  container.appendChild(parent);

  return parent;
}

var REQUIRED_MODEL_ATTRS = {
  row: [ 'next', 'previous' ],
  column: [ 'next', 'previous' ],
  cell: [ 'row', 'column' ]
};

/**
 * The main drawing sheet.
 *
 * @class
 * @constructor
 *
 * @emits Sheet#sheet.init
 *
 * @param {Object} config
 * @param {EventBus} eventBus
 * @param {GraphicsFactory} graphicsFactory
 * @param {ElementRegistry} elementRegistry
 */
function Sheet(config, eventBus, elementRegistry, graphicsFactory) {
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;

  this._init(config || {});
}

Sheet.$inject = [ 'config.sheet', 'eventBus', 'elementRegistry', 'graphicsFactory' ];

module.exports = Sheet;


Sheet.prototype.getLastColumn = function() {
  return this._lastColumn;
};

Sheet.prototype.setLastColumn = function(element) {
  this._lastColumn = element;
};

Sheet.prototype.getLastRow = function(type) {
  return this._lastRow[type];
};

Sheet.prototype.setLastRow = function(element, type) {
  this._lastRow[type] = element;
};

Sheet.prototype.setSibling = function(first, second) {
  if (first) first.next = second;
  if (second) second.previous = first;
};

Sheet.prototype.addSiblings = function(type, element) {
  var tmp, subType;
  if (type === 'row') {
    subType = element.isHead ? 'head' : element.isFoot ? 'foot' : 'body';
  }
  if (!element.previous && !element.next) {
    if (type === 'column') {
      // add column to end of table per default
      element.next = null;
      this.setSibling(this.getLastColumn(), element);
      this.setLastColumn(element);
    } else if (type === 'row') {
      // add row to end of table per default
      element.next = null;
      this.setSibling(this.getLastRow(subType), element);
      this.setLastRow(element, subType);
    }
  } else if (element.previous && !element.next) {
    tmp = element.previous.next;
    this.setSibling(element.previous, element);
    this.setSibling(element, tmp);
    if(!tmp) {
      if(type === 'row') {
        this.setLastRow(element, subType);
      } else if (type === 'column') {
        this.setLastColumn(element, subType);
      }
    }
  } else if (!element.previous && element.next) {
    tmp = element.next.previous;
    this.setSibling(tmp, element);
    this.setSibling(element, element.next);
  } else if (element.previous && element.next) {
    if (element.previous.next !== element.next) {
      throw new Error('cannot set both previous and next when adding new element <' + type + '>');
    } else {
      this.setSibling(element.previous, element);
      this.setSibling(element, element.next);
    }
  }
};

Sheet.prototype.removeSiblings = function(type, element) {
  var subType;
  if (type === 'row') {
    subType = element.isHead ? 'head' : element.isFoot ? 'foot' : 'body';
  }
  if (type === 'column') {
    if (this.getLastColumn() === element) {
      this.setLastColumn(element.previous);
    }
  } else
  if (type === 'row') {
    if (this.getLastRow(subType) === element) {
      this.setLastRow(element.previous, subType);
    }
  }
  if (element.previous) {
    element.previous.next = element.next;
  }
  if (element.next) {
    element.next.previous = element.previous;
  }
  delete element.previous;
  delete element.next;
};

Sheet.prototype._init = function(config) {

  // Creates a <table> element that is wrapped into a <div>.
  // This way we are always able to correctly figure out the size of the table element
  // by querying the parent node.
  //
  // <div class="tjs-container" style="width: {desired-width}, height: {desired-height}">
  //   <table width="100%" height="100%">
  //    ...
  //   </table>
  // </div>

  // html container
  var eventBus = this._eventBus,
      container = createContainer(config),
      self = this;

  this._container = container;

  this._rootNode = document.createElement('table');

  assign(this._rootNode.style, {
    width: '100%'
  });

  container.appendChild(this._rootNode);

  this._head = document.createElement('thead');
  this._body = document.createElement('tbody');
  this._foot = document.createElement('tfoot');

  this._rootNode.appendChild(this._head);
  this._rootNode.appendChild(this._body);
  this._rootNode.appendChild(this._foot);

  this._lastColumn = null;
  this._lastRow = {
    head: null,
    body: null,
    foot: null
  };

  eventBus.on('table.init', function(event) {

    /**
     * An event indicating that the table is ready to be used.
     *
     * @memberOf Sheet
     *
     * @event sheet.init
     *
     * @type {Object}
     * @property {DOMElement} sheet the created table element
     * @property {Snap<SVGGroup>} viewport the direct parent of diagram elements and shapes
     */

    eventBus.fire('sheet.init', {sheet: self._rootNode});
  });

  eventBus.on('table.destroy', function() {

    var parent = self._container.parentNode;

    if (parent) {
      parent.removeChild(container);
    }

    eventBus.fire('sheet.destroy', { sheet: self._rootNode });
  });

};


/**
 * Returns the html element that encloses the
 * drawing canvas.
 *
 * @return {DOMNode}
 */
Sheet.prototype.getContainer = function() {
  return this._container;
};


/**
 * Returns the table body element of the table.
 *
 * @return {DOMNode}
 */
Sheet.prototype.getBody = function() {
  return this._body;
};

/**
 * Moves a row above or below another row
 *
 */
Sheet.prototype.moveRow = function(source, target, above) {

  if(source === target) {
    return;
  }

  this._eventBus.fire('row.move', {
    source: source,
    target: target,
    above: above
  });

  // update the last row if necessary
  if(this.getLastRow('body') === source) {
    this.setLastRow(source.previous, 'body');
  }

  // re-wire the prev/next relations for the source
  if(source.previous) {
    source.previous.next = source.next;
  }
  if(source.next) {
    source.next.previous = source.previous;
  }
  // re-wire the prev/next relations for the target
  if(above) {
    if(target.previous) {
      // (previous --> source --> target)
      target.previous.next = source;
      source.previous = target.previous;

      source.next = target;
      target.previous = source;
    } else {
      // (null --> source --> target)
      source.previous = null;

      source.next = target;
      target.previous = source;
    }
  } else {
    if(target.next) {
      // (target --> source --> next)
      target.next.previous = source;
      source.next = target.next;

      source.previous = target;
      target.next = source;
    } else {
      // (target --> source --> null)
      source.next = null;

      source.previous = target;
      target.next = source;
      this.setLastRow(source, 'body');
    }
  }

  this._graphicsFactory.moveRow(source, target, above);

  this._eventBus.fire('row.moved', {
    source: source,
    target: target,
    above: above
  });

};


///////////// add functionality ///////////////////////////////

Sheet.prototype._ensureValid = function(type, element) {
  if (!element.id) {
    throw new Error('element must have an id');
  }

  if (this._elementRegistry.get(element.id)) {
    throw new Error('element with id ' + element.id + ' already exists');
  }

  var requiredAttrs = REQUIRED_MODEL_ATTRS[type];

  var valid = every(requiredAttrs, function(attr) {
    return typeof element[attr] !== 'undefined';
  });

  if (!valid) {
    throw new Error(
      'must supply { ' + requiredAttrs.join(', ') + ' } with ' + type);
  }
};

/**
 * Adds an element to the sheet.
 *
 * This wires the parent <-> child relationship between the element and
 * a explicitly specified parent or an implicit root element.
 *
 * During add it emits the events
 *
 *  * <{type}.add> (element, parent)
 *  * <{type}.added> (element, gfx)
 *
 * Extensions may hook into these events to perform their magic.
 *
 * @param {String} type
 * @param {Object|djs.model.Base} element
 * @param {Object|djs.model.Base} [parent]
 *
 * @return {Object|djs.model.Base} the added element
 */
Sheet.prototype._addElement = function(type, element, parent) {

  element._type = type;

  var eventBus = this._eventBus,
      graphicsFactory = this._graphicsFactory;

  this._ensureValid(type, element);

  eventBus.fire(type + '.add', element);

  // create graphics

  element.parent = parent || this._rootNode;

  var gfx = graphicsFactory.create(type, element, element.parent);

  this._elementRegistry.add(element, gfx);

  // update its visual
  graphicsFactory.update(type, element, gfx);

  eventBus.fire(type + '.added', { element: element, gfx: gfx });

  return element;
};

Sheet.prototype.addRow = function(row) {
  this.addSiblings('row', row);

  var r = this._addElement('row', row, row.isHead ? this._head : row.isFoot ? this._foot : this._body);

  this._eventBus.fire('cells.add', r);

  // create new cells
  var self = this;
  forEach(this._elementRegistry.filter(function(el) {
    return el._type === 'column';
  }).sort(function(a, b) {
    var c = a;
    while (!!(c = c.next)) {
      if (c === b) {
        return -1;
      }
    }
    return 1;
  }), function(el) {
    self._addCell({row: r, column: el, id: 'cell_'+el.id+'_'+r.id});
  });

  this._eventBus.fire('cells.added', r);

  return r;
};

Sheet.prototype.addColumn = function(column) {

  this.addSiblings('column', column);

  var c = this._addElement('column', column);

  this._eventBus.fire('cells.add', c);

  // create new cells
  var self = this;
  forEach(this._elementRegistry.filter(function(el) {
    return el._type === 'row';
  }), function(el) {
    self._addCell({row: el, column: c, id: 'cell_'+c.id+'_'+el.id});
  });

  this._eventBus.fire('cells.added', c);

  return c;
};

Sheet.prototype._addCell = function(cell) {
  return this._addElement('cell', cell, this._elementRegistry.getGraphics(cell.row.id));
};

Sheet.prototype.setCellContent = function(config) {
  if (typeof config.column === 'object') {
    config.column = config.column.id;
  }
  if (typeof config.row === 'object') {
    config.row = config.row.id;
  }

  this._elementRegistry.get('cell_'+config.column+'_'+config.row).content = config.content;
  this._graphicsFactory.update('cell', this._elementRegistry.get('cell_'+config.column+'_'+config.row),
    this._elementRegistry.getGraphics('cell_'+config.column+'_'+config.row));
};

Sheet.prototype.getCellContent = function(config) {
  return this._elementRegistry.get('cell_'+config.column+'_'+config.row).content;
};


/**
 * Internal remove element
 */
Sheet.prototype._removeElement = function(element, type) {

  var elementRegistry = this._elementRegistry,
      graphicsFactory = this._graphicsFactory,
      eventBus = this._eventBus;

  element = elementRegistry.get(element.id || element);

  if (!element) {
    // element was removed already
    return;
  }

  eventBus.fire(type + '.remove', { element: element });

  graphicsFactory.remove(element);

  element.parent = null;

  elementRegistry.remove(element);

  eventBus.fire(type + '.removed', { element: element });

  return element;
};

Sheet.prototype.removeRow = function(element) {

  this.removeSiblings('row', element);

  var el = this._removeElement(element, 'row');

  // remove cells
  this._eventBus.fire('cells.remove', el);

  var self = this;
  forEach(this._elementRegistry.filter(function(el) {
    return el.row === element;
  }), function(el) {
    self._removeElement(el.id, 'cell');
  });

  this._eventBus.fire('cells.removed', el);

  return el;
};

Sheet.prototype.removeColumn = function(element) {

  this.removeSiblings('column', element);

  var el = this._removeElement(element, 'column');

  // remove cells
  this._eventBus.fire('cells.remove', el);

  var self = this;
  forEach(this._elementRegistry.filter(function(el) {
    return el.column === element;
  }), function(el) {
    self._removeElement(el.id, 'cell');
  });

  this._eventBus.fire('cells.removed', el);

  return el;
};

Sheet.prototype.getRootElement = function() {
  return this._rootNode;
};

Sheet.prototype.setRootElement = function(root) {
  this._rootNode = root;
};
