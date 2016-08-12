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

  container.appendChild(parent);

  return parent;
}

var REQUIRED_MODEL_ATTRS = {
  row: [ 'next', 'previous' ],
  column: [ 'next', 'previous' ],
  cell: [ 'row', 'column' ]
};

var LOW_PRIORITY = 250;

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
  this._config = config;

  this._init(config || {});
}

Sheet.$inject = [ 'config.sheet', 'eventBus', 'elementRegistry', 'graphicsFactory' ];

module.exports = Sheet;


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
    width: ensurePx(config.width),
    height: ensurePx(config.height)
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

    eventBus.fire('sheet.init', { sheet: self._rootNode });

    eventBus.fire('sheet.resized');
  });

  // This event expects that another party hooks up earlier and provides
  // the new width to be used.
  eventBus.on('sheet.resized', LOW_PRIORITY, function(evt) {
    var context = evt.context;

    if (!context) {
      return;
    }

    self.setWidth(context.newWidth);
  });

  eventBus.on('table.destroy', LOW_PRIORITY, this._destroy, this);


  eventBus.on('table.clear', LOW_PRIORITY, function() {

    /**
     * An event indicating that the sheet is going to be cleared.
     * Services can now hook in with this event and reset their states.
     *
     * @memberOf Sheet
     *
     * @event sheet.clear
     */
    eventBus.fire('sheet.clear');

    this._clear();

    /**
     * An event indicating that the sheet has been cleared.
     * Interested services can now hook in with this event and instantiate their states.
     *
     * @memberOf Sheet
     *
     * @event sheet.cleared
     *
     * @type {Object}
     * @property {DOMElement} sheet the created table element
     */
    eventBus.fire('sheet.cleared', { sheet: self._rootNode });

    eventBus.fire('sheet.resized');
  }, this);
};

Sheet.prototype._destroy = function() {
  var eventBus = this._eventBus;

  var container = this._container,
      rootNode = this._rootNode,
      parent;

  eventBus.fire('sheet.destroy', { sheet: rootNode });

  parent = container.parentNode;

  if (parent) {
    parent.removeChild(container);
  }

  delete this._container;
  delete this._rootNode;
};

Sheet.prototype._clear = function() {
  var elementRegistry = this._elementRegistry;

  var self = this,
      allElements = elementRegistry.getAll();

  // remove all elements
  allElements.forEach(function(element) {
    if (element.element && element.element.id === 'decisionTable') {
      self.setRootElement(null, true);
    } else {
      self._removeElement(element, element.type);
    }
  });

  this._lastColumn = null;
  this._lastRow = {
    head: null,
    body: null,
    foot: null
  };
};

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
    if (!tmp) {
      if (type === 'row') {
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
  var eventBus = this._eventBus,
      graphicsFactory = this._graphicsFactory;

  if (source === target) {
    return;
  }

  eventBus.fire('row.move', {
    source: source,
    target: target,
    above: above
  });

  // update the last row if necessary
  if (this.getLastRow('body') === source) {
    this.setLastRow(source.previous, 'body');
  }

  // re-wire the prev/next relations for the source
  if (source.previous) {
    source.previous.next = source.next;
  }
  if (source.next) {
    source.next.previous = source.previous;
  }
  // re-wire the prev/next relations for the target
  if (above) {
    if (target.previous) {
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
    if (target.next) {
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

  graphicsFactory.moveRow(source, target, above);

  eventBus.fire('row.moved', {
    source: source,
    target: target,
    above: above
  });

};

/**
 * Moves a column left or right another column
 *
 */
Sheet.prototype.moveColumn = function(source, target, left) {
  var eventBus = this._eventBus,
      graphicsFactory = this._graphicsFactory;

  if (source === target) {
    return;
  }

  eventBus.fire('column.move', {
    source: source,
    target: target,
    left: left
  });

  // update the last row if necessary
  if (this.getLastColumn() === source) {
    this.setLastColumn(source.previous);
  }

  // re-wire the prev/next relations for the source
  if (source.previous) {
    source.previous.next = source.next;
  }
  if (source.next) {
    source.next.previous = source.previous;
  }
  // re-wire the prev/next relations for the target
  if (left) {
    if (target.previous) {
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
    if (target.next) {
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

      this.setLastColumn(source);
    }
  }

  graphicsFactory.moveColumn(source, target, left);

  eventBus.fire('column.moved', {
    source: source,
    target: target,
    left: left
  });

};


///////////// add functionality ///////////////////////////////

Sheet.prototype._ensureValid = function(type, element) {
  var elementRegistry = this._elementRegistry;

  if (!element.id) {
    throw new Error('element must have an id');
  }

  if (elementRegistry.get(element.id)) {
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
  var eventBus = this._eventBus,
      graphicsFactory = this._graphicsFactory;

  element._type = type;

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
  var eventBus = this._eventBus,
      elementRegistry = this._elementRegistry;

  var self = this,
      columns;

  this.addSiblings('row', row);

  var r = this._addElement('row', row, row.isHead ? this._head : row.isFoot ? this._foot : this._body);

  eventBus.fire('cells.add', r);

  // create new cells
  columns = elementRegistry.filter(function(el) {
    return el._type === 'column';
  });

  forEach(columns.sort(function(a, b) {
    var c = a;
    while ((c = c.next)) {
      if (c === b) {
        return -1;
      }
    }
    return 1;
  }), function(el) {
    self._addCell({ row: r, column: el, id: 'cell_'+el.id+'_'+r.id });
  });

  eventBus.fire('cells.added', r);

  return r;
};

Sheet.prototype.addColumn = function(column) {
  var eventBus = this._eventBus,
      elementRegistry = this._elementRegistry;

  var self = this,
      rows;

  this.addSiblings('column', column);

  var c = this._addElement('column', column);

  eventBus.fire('cells.add', c);

  rows = elementRegistry.filter(function(el) {
    return el._type === 'row';
  });

  // create new cells
  forEach(rows, function(el) {
    self._addCell({ row: el, column: c, id: 'cell_' + c.id + '_' + el.id });
  });

  eventBus.fire('cells.added', c);

  return c;
};

Sheet.prototype._addCell = function(cell) {
  var elementRegistry = this._elementRegistry;

  var row = elementRegistry.getGraphics(cell.row.id);

  return this._addElement('cell', cell, row);
};

Sheet.prototype.setCellContent = function(config) {
  var elementRegistry = this._elementRegistry,
      graphicsFactory = this._graphicsFactory;

  if (typeof config.column === 'object') {
    config.column = config.column.id;
  }
  if (typeof config.row === 'object') {
    config.row = config.row.id;
  }

  elementRegistry.get('cell_' + config.column + '_' + config.row).content = config.content;

  graphicsFactory.update('cell',
    elementRegistry.get('cell_' + config.column + '_' + config.row),
    elementRegistry.getGraphics('cell_' + config.column + '_' + config.row));
};

Sheet.prototype.getCellContent = function(config) {
  var elementRegistry = this._elementRegistry;

  return elementRegistry.get('cell_' + config.column + '_' + config.row).content;
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
  var eventBus = this._eventBus;

  this.removeSiblings('row', element);

  var el = this._removeElement(element, 'row');

  // remove cells
  eventBus.fire('cells.remove', el);

  var self = this;
  forEach(this._elementRegistry.filter(function(el) {
    return el.row === element;
  }), function(el) {
    self._removeElement(el.id, 'cell');
  });

  eventBus.fire('cells.removed', el);

  return el;
};

Sheet.prototype.removeColumn = function(element) {
  var eventBus = this._eventBus;

  this.removeSiblings('column', element);

  var el = this._removeElement(element, 'column');

  // remove cells
  eventBus.fire('cells.remove', el);

  var self = this;
  forEach(this._elementRegistry.filter(function(el) {
    return el.column === element;
  }), function(el) {
    self._removeElement(el.id, 'cell');
  });

  eventBus.fire('cells.removed', el);

  return el;
};

Sheet.prototype.getRootElement = function() {
  return this._rootNode;
};

Sheet.prototype.setRootElement = function(element, override) {

  if (element) {
    this._ensureValid('root', element);
  }

  var currentRoot = this._rootNode,
      elementRegistry = this._elementRegistry,
      eventBus = this._eventBus;

  if (currentRoot) {
    if (!override) {
      throw new Error('rootNode already set, need to specify override');
    }

    // simulate element remove event sequence
    eventBus.fire('root.remove', { element: currentRoot });
    eventBus.fire('root.removed', { element: currentRoot });

    elementRegistry.remove(currentRoot);
  }

  if (element) {
    var gfx = this.getDefaultLayer();

    // resemble element add event sequence
    eventBus.fire('root.add', { element: element });

    elementRegistry.add(element, gfx, this._svg);

    eventBus.fire('root.added', { element: element, gfx: gfx });
  }

  this._rootNode = element;

  return element;
};

Sheet.prototype.setWidth = function(newWidth) {
  var container = this.getContainer();

  if (!newWidth) {
    return;
  }

  if (typeof newWidth === 'number') {
    newWidth = newWidth + 'px';
  }

  container.style.width = newWidth;
};

Sheet.prototype.resized = function() {
  var eventBus = this._eventBus;

  eventBus.fire('sheet.resized');
};
