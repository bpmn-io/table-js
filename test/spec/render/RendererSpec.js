
// eslint-disable-next-line
import Inferno from 'inferno';

// eslint-disable-next-line
import Component from 'inferno-component';

import { query as domQuery, remove as domRemove } from 'min-dom';

import { inject, bootstrap } from 'test/TestHelper';

import RenderModule from 'lib/render';


describe('render', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    container.classList.add('iwantthiscontainer');

    document.body.appendChild(container);

    bootstrap({
      container,
      modules: [ RenderModule ]
    })();
  });

  afterEach(function() {
    domRemove(container);
  });


  it('should render', inject(function(renderer) {
    
    // then
    expect(domQuery('.tjs-container', container)).to.exist;
    expect(domQuery('.tjs-table', container)).to.exist;
  }));

});