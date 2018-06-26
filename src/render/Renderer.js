import { render } from 'inferno';

import TableComponent from './components/TableComponent';

export default class Renderer {

  constructor(changeSupport, components, config, eventBus, injector) {
    const { container } = config;

    this._container = container;

    eventBus.on('root.added', () => {
      render(<TableComponent injector={ injector } />, container);
    });

    eventBus.on('root.remove', () => {
      render(null, container);
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