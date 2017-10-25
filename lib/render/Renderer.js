import Inferno from 'inferno';
import Component from 'inferno-component';

import TableComponent from './TableComponent';

export default class Renderer {

  constructor(config, eventBus, injector) {
    const { container } = config;

    const $container = document.createElement('div');

    $container.classList.add('tjs-container');

    container.appendChild($container);

    Inferno.render(<TableComponent eventBus={ eventBus } injector={ injector } />, $container);
  }

}

Renderer.$inject = [ 'config', 'eventBus', 'injector' ];