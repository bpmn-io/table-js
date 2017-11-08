import Inferno from 'inferno';
import Component from 'inferno-component';

import TableComponent from './components/TableComponent';

export default class Renderer {

  constructor(components, config, injector) {
    const { container } = config;

    const $container = document.createElement('div');

    $container.classList.add('tjs-container');

    container.appendChild($container);

    Inferno.render(<TableComponent components={ components } injector={ injector } />, $container);
  }

}

Renderer.$inject = [ 'components', 'config', 'injector' ];