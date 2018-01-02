import Inferno from 'inferno';

import TableComponent from './components/TableComponent';

export default class Renderer {

  constructor(changeSupport, components, config, eventBus, injector) {
    const { container } = config;

    this._container = container;

    eventBus.on('root.added', () => {
      Inferno.render(<TableComponent injector={ injector } />, container);
    });

    eventBus.on('root.remove', () => {
      Inferno.render(null, container);
    });
  }

  getContainer() {
    return this._container;
  }

}

Renderer.$inject = [
  'changeSupport',
  'components',
  'config.renderer',
  'eventBus',
  'injector'
];