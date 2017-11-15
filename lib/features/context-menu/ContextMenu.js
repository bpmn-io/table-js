import ContextMenuComponent from './components/ContextMenuComponent';

export default class ContextMenu {
  constructor(components, eventBus) {
    this._eventBus = eventBus;

    components.onGetComponent('table.before', () => ContextMenuComponent);
  }

  open(position, context) {
    this._eventBus.fire('contextMenu.open', {
      position,
      context
    });
  }

  close() {
    this._eventBus.fire('contextMenu.close');
  }
}

ContextMenu.$inject = [ 'components', 'eventBus' ];