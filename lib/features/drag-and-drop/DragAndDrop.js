import { Row, Col } from '../../model';

import {
  closest as domClosest,
  delegate,
  event as domEvent
} from 'min-dom';

export default class DragAndDrop {
  constructor(eventBus, renderer, modeling, sheet) {
    this._eventBus = eventBus;
    this._renderer = renderer;
    this._modeling = modeling;
    this._sheet = sheet;

    this._currentDraggedElement = null;
    this._currentDragOverElement = null;

    eventBus.on('table.destroy', () => {
      this._unbindListeners();
    });
  }

  _bindListeners() {
    const container = this._renderer.getContainer();

    delegate.bind(container, 'th', 'dragover', this.onDragOver);
    delegate.bind(container, 'td', 'dragover', this.onDragOver);
    delegate.bind(container, 'th', 'drop', this.onDrop);
    delegate.bind(container, 'td', 'drop', this.onDrop);

    domEvent.bind(document, 'dragend', this.onDragEnd);
  }

  _unbindListeners() {
    const container = this._renderer.getContainer();

    delegate.unbind(container, 'dragover', this.onDragOver);
    delegate.unbind(container, 'dragover', this.onDragOver);
    delegate.unbind(container, 'drop', this.onDrop);
    delegate.unbind(container, 'drop', this.onDrop);

    domEvent.unbind(document, 'dragend', this.onDragEnd);
  }

  startDrag(element, event) {
    event.dataTransfer.effectAllowed = 'move';

    // QUIRK:Firefox won't fire events unless data was set
    if (event.dataTransfer.setData) {
      event.dataTransfer.setData('text', 'foo');
    }

    this._currentDraggedElement = element;

    this._bindListeners();

    this._eventBus.fire('dragAndDrop.dragStart', {
      draggedElement: element
    });
  }

  onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const { target } = event;

    const closestCell = isCell(target)
      ? target
      : (domClosest(target, 'th') || domClosest(target, 'td'));

    if (closestCell) {

      this._eventBus.fire('dragAndDrop.dragOver', {
        draggedElement: this._currentDraggedElement,
        dragOverElement: closestCell,
        event
      });

      if (closestCell !== this._currentDragOverElement) {

        if (this._currentDragOverElement) {
          this._eventBus.fire('dragAndDrop.dragLeave', {
            draggedElement: this._currentDraggedElement,
            dragOverElement: this._currentDragOverElement,
            event
          });
        }

        this._eventBus.fire('dragAndDrop.dragEnter', {
          draggedElement: this._currentDraggedElement,
          dragOverElement: closestCell,
          event
        });

        this._currentDragOverElement = closestCell;

      }
    }
  }

  onDrop = (event) => {

    // QUIRK: Firefox will redirect if not prevented
    event.preventDefault();
    event.stopPropagation();

    this._unbindListeners();

    const target = this._eventBus.fire('dragAndDrop.drop', {
      draggedElement: this._currentDraggedElement,
      dragOverElement: this._currentDragOverElement,
      event
    });

    if (target) {

      if (this._currentDraggedElement instanceof Row) {
        const { rows } = this._sheet.getRoot();

        let index = rows.indexOf(target);

        this._modeling.moveRow(this._currentDraggedElement, index);
      } else if (this._currentDraggedElement instanceof Col) {
        const { cols } = this._sheet.getRoot();

        let index = cols.indexOf(target);

        this._modeling.moveCol(this._currentDraggedElement, index);
      }
    }
  }

  onDragEnd = (event) => {
    this._eventBus.fire('dragAndDrop.dragEnd', {
      draggedElement: this._currentDraggedElement,
      dragOverElement: this._currentDragOverElement,
      event
    });
  }
}

DragAndDrop.$inject = [ 'eventBus', 'renderer', 'modeling', 'sheet' ];

// helpers //////////

function isCell(element) {
  return element.tagName === 'TH'
    || element.tagName === 'TD';
}