import {
  classes as domClasses,
  closest as domClosest
} from 'min-dom';

/**
 * Selects table cells on on left & right click.
 */
export default class SelectionBehavior {
  constructor(elementRegistry, eventBus, renderer, selection) {
    this._elementRegistry = elementRegistry;
    this._renderer = renderer;
    this._selection = selection;

    this._onClick = this._onClick.bind(this);

    eventBus.on([ 'cell.click', 'cell.contextmenu'], ({ id }) => {
      const element = elementRegistry.get(id);

      if (!element) {
        return;
      }

      selection.select(element);

      window.addEventListener('click', this._onClick);
    });

    eventBus.on('row.remove', ({ row }) => {
      const currentSelection = selection.get();

      if (!currentSelection) {
        return;
      }

      if (row === currentSelection.row) {
        selection.deselect();
      }
    });

    eventBus.on('col.remove', ({ col }) => {
      const currentSelection = selection.get();

      if (!currentSelection) {
        return;
      }

      if (col === currentSelection.col) {
        selection.deselect();
      }
    });
  }

  _onClick(event) {
    const { target } = event;

    const contains = this._renderer.getContainer().contains(target);

    // do not deselect on context menu interaction
    if (domClasses(target).has('no-deselect') || domClosest(target, '.no-deselect')) {
      return;
    }

    if (!contains) {
      this._selection.deselect();
    } else {
      const node = findClosestCell(target);

      if (!node) {
        this._selection.deselect();

        window.removeEventListener('click', this._onClick);

        return;
      }

      const { dataset } = node;

      if (!this._elementRegistry.get(dataset.elementId)) {
        this._selection.deselect();

        window.removeEventListener('click', this._onClick);
      }
    }
  }
}

SelectionBehavior.$inject = [
  'elementRegistry',
  'eventBus',
  'renderer',
  'selection'
];

// helpers /////////////

function findClosestCell(element) {
  const closest = domClosest(element, 'th') || domClosest(element, 'td');

  const isCell = (
    element.tagName
      && (element.tagName.toLowerCase() === 'th'
        || element.tagName.toLowerCase() === 'td')
  );

  if (isCell) {
    return element;
  } else if (closest) {
    return closest;
  }
}