import Inferno from 'inferno';
import Component from 'inferno-component';

import TableComponent from './components/TableComponent';

export default class Renderer {

  constructor(changeSupport, components, config, injector) {
    const { container } = config;

    this._container = container;

    Inferno.render(
      <TableComponent injector={ injector } />, container);
  }

  getContainer() {
    return this._container;
  }

}

Renderer.$inject = [ 'changeSupport', 'components', 'config.renderer', 'injector' ];