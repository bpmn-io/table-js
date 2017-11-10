import Inferno from 'inferno';
import Component from 'inferno-component';

import TableComponent from './components/TableComponent';

export default class Renderer {

  constructor(changeSupport, components, config, injector) {
    const { container } = config;

    Inferno.render(
      <TableComponent injector={ injector } />, container);
  }

}

Renderer.$inject = [ 'changeSupport', 'components', 'config', 'injector' ];