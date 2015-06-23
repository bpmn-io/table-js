'use strict';

/**
 * Adds change support to the sheet, including
 *
 * <ul>
 *   <li>redrawing rows and cells on change</li>
 * </ul>
 *
 * @param {EventBus} eventBus
 * @param {ElementRegistry} elementRegistry
 * @param {GraphicsFactory} graphicsFactory
 */
function ChangeSupport(eventBus, elementRegistry, graphicsFactory) {

  // redraw row / cells on change

  eventBus.on('element.changed', function(event) {

    var element = event.element;

    if (!event.gfx) {
      event.gfx = elementRegistry.getGraphics(element);
    }

    // shape + gfx may have been deleted
    if (!event.gfx) {
      return;
    }

    if (element.column) {
      eventBus.fire('cell.changed', event);
    } else {
      eventBus.fire('row.changed', event);
    }
  });

  eventBus.on('elements.changed', function(event) {
    for(var i = 0; i < event.elements.length; i++) {
      eventBus.fire('element.changed', { element: event.elements[i] });
    }
  });

  eventBus.on('cell.changed', function(event) {
    graphicsFactory.update('cell', event.element, event.gfx);
  });

  eventBus.on('row.changed', function(event) {
    graphicsFactory.update('row', event.element, event.gfx);

    // also update all cells of the row
    var cells = elementRegistry.filter(function(ea) {
      return ea.row === event.element;
    });
    for(var i = 0; i < cells.length; i++) {
      graphicsFactory.update('cell', cells[i], elementRegistry.getGraphics(cells[i]));
    }
  });
}

ChangeSupport.$inject = [ 'eventBus', 'elementRegistry', 'graphicsFactory' ];

module.exports = ChangeSupport;
