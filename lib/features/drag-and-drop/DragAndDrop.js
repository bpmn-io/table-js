import { Row, Col } from '../../model';

import {
  closest as domClosest,
  event as domEvent
} from 'min-dom';

const TARGET_SELECTOR =
  `.dmn-decision-table-container td,
   .dmn-decision-table-container th`;

export default class DragAndDrop {
  constructor(eventBus, renderer, modeling, sheet) {
    this._eventBus = eventBus;
    this._renderer = renderer;
    this._modeling = modeling;
    this._sheet = sheet;

    this._dragContext = null;

    eventBus.on('table.destroy', () => {
      this._unbindListeners();
    });
  }

  _bindListeners() {
    domEvent.bind(document, 'dragover', this.handleDragOver);
    domEvent.bind(document, 'drop', this.handleDrop);
    domEvent.bind(document, 'dragend', this.handleDragEnd);
  }

  _unbindListeners() {
    domEvent.unbind(document, 'dragover', this.handleDragOver);
    domEvent.unbind(document, 'drop', this.handleDrop);
    domEvent.unbind(document, 'dragend', this.handleDragEnd);
  }

  _emit(eventName, originalEvent) {

    return this._eventBus.fire(eventName, {
      dragContext: this._dragContext,
      originalEvent
    });
  }

  startDrag(element, event) {

    stopEvent(event, true);

    event.dataTransfer.effectAllowed = 'move';

    // QUIRK: Firefox won't fire events unless data was set
    if (event.dataTransfer.setData) {
      event.dataTransfer.setData('text', '__DUMMY');
    }

    this._dragContext = {
      draggedElement: element
    };

    this._bindListeners();

    this._emit('dragAndDrop.dragStart', event);
  }

  handleDragOver = (event) => {

    // we're taking over (!)
    stopEvent(event);

    const targetEl = event.target;

    const cellEl = domClosest(targetEl, TARGET_SELECTOR, true);

    let allowed = !!cellEl;

    const {
      hoverEl
    } = this._dragContext;

    // drag leave
    if (hoverEl && hoverEl !== cellEl) {
      this._emit('dragAndDrop.dragLeave', event);

      // unset target element
      this._dragContext.targetEl = null;

      // unset hover element
      this._dragContext.hoverEl = null;
    }

    if (cellEl) {

      // drag enter
      if (cellEl !== hoverEl) {

        // new hover element
        this._dragContext.hoverEl = cellEl;

        allowed = this._emit('dragAndDrop.dragEnter', event);

        if (allowed !== false) {
          // new targetEl
          this._dragContext.targetEl = cellEl;
        }
      }

      // drag over
      allowed = this._emit('dragAndDrop.dragOver', event);
    }

    event.dataTransfer.dropEffect = allowed !== false ? 'move' : 'none';
  }

  handleDrop = (event) => {

    // prevent default drop action
    // QUIRK: Firefox will redirect if not prevented
    stopEvent(event);

    const target = this._emit('dragAndDrop.drop', event);

    if (target) {

      const {
        draggedElement
      } = this._dragContext;

      if (draggedElement instanceof Row) {
        const { rows } = this._sheet.getRoot();

        let index = rows.indexOf(target);

        this._modeling.moveRow(draggedElement, index);
      } else if (draggedElement instanceof Col) {
        const { cols } = this._sheet.getRoot();

        let index = cols.indexOf(target);

        this._modeling.moveCol(draggedElement, index);
      }
    }

    // manually call to drag end needed, as we prevent the default
    // browser behavior / drag end handling via
    // event.preventDefault();
    this.handleDragEnd(event);
  }

  handleDragEnd = (event) => {

    // prevent default drop action
    stopEvent(event);

    this._unbindListeners();
    this._emit('dragAndDrop.dragEnd', event);

    this._dragContext = null;
  }

}

DragAndDrop.$inject = [
  'eventBus',
  'renderer',
  'modeling',
  'sheet'
];



// helpers /////////////////

function stopEvent(event, preventDefault) {
  event.stopPropagation();

  if (preventDefault !== true) {
    event.preventDefault();
  }
}